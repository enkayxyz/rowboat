import posthog from 'posthog-js';

const disabled = process.env.NEXT_PUBLIC_DISABLE_TELEMETRY === '1' || process.env.NEXT_PUBLIC_DISABLE_TELEMETRY === 'true';

if (!disabled && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
  });
}
