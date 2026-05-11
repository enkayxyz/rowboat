'use client';

import { useEffect, useState } from 'react';

type PrivacySettings = {
  disableTelemetry: boolean;
  disableUpdateChecks: boolean;
  airgappedMode: boolean;
  allowCloudConnectors: boolean;
  allowCloudLLM: boolean;
};

const defaultSettings: PrivacySettings = {
  disableTelemetry: false,
  disableUpdateChecks: false,
  airgappedMode: false,
  allowCloudConnectors: true,
  allowCloudLLM: true,
};

export default function PrivacyPage() {
  const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/privacy-settings').then(r => r.json()).then(setSettings).catch(() => setStatus('Failed to load settings'));
  }, []);

  const save = async () => {
    const res = await fetch('/api/privacy-settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings)
    });
    if (res.ok) setStatus('Saved. Restart app to apply all startup-level changes.');
    else setStatus('Save failed');
  };

  const toggle = (k: keyof PrivacySettings) => setSettings(s => ({ ...s, [k]: !s[k] }));

  return <main className="p-8 max-w-3xl mx-auto space-y-6">
    <h1 className="text-2xl font-semibold">Privacy Control Center</h1>
    <p className="text-sm text-gray-500">Phase 1 controls: telemetry, update checks, and airgapped policy posture.</p>

    {([
      ['disableTelemetry', 'Disable telemetry', 'Turns off analytics/event telemetry.'],
      ['disableUpdateChecks', 'Disable update checks', 'Prevents checking remote release/update endpoints.'],
      ['airgappedMode', 'Airgapped mode (strict)', 'Blocks cloud-first behavior where policy checks are implemented.'],
      ['allowCloudConnectors', 'Allow cloud connectors', 'Informational in Phase 1. Full enforcement in Phase 2.'],
      ['allowCloudLLM', 'Allow cloud LLM providers', 'Informational in Phase 1. Full enforcement in Phase 3.'],
    ] as const).map(([key, label, help]) => (
      <label key={key} className="flex items-start justify-between gap-4 border rounded p-4">
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-gray-500">{help}</div>
        </div>
        <input type="checkbox" checked={settings[key]} onChange={() => toggle(key)} />
      </label>
    ))}

    <button onClick={save} className="px-4 py-2 bg-black text-white rounded">Save privacy settings</button>
    {status && <p className="text-sm">{status}</p>}
  </main>;
}
