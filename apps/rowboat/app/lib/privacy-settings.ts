import { promises as fs } from 'fs';
import path from 'path';

export type PrivacySettings = {
  disableTelemetry: boolean;
  disableUpdateChecks: boolean;
  airgappedMode: boolean;
  allowCloudConnectors: boolean;
  allowCloudLLM: boolean;
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  disableTelemetry: false,
  disableUpdateChecks: false,
  airgappedMode: false,
  allowCloudConnectors: true,
  allowCloudLLM: true,
};

const CONFIG_PATH = path.join(process.env.HOME || process.cwd(), '.rowboat', 'config', 'privacy.json');

export async function getPrivacySettings(): Promise<PrivacySettings> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PrivacySettings>;
    return { ...DEFAULT_PRIVACY_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_PRIVACY_SETTINGS;
  }
}

export async function savePrivacySettings(settings: PrivacySettings): Promise<PrivacySettings> {
  const merged = { ...DEFAULT_PRIVACY_SETTINGS, ...settings };
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(merged, null, 2));
  return merged;
}

export async function telemetryEnabled(): Promise<boolean> {
  const settings = await getPrivacySettings();
  return !settings.disableTelemetry;
}
