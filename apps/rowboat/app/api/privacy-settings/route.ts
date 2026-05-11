import { NextRequest, NextResponse } from 'next/server';
import { getPrivacySettings, savePrivacySettings } from '@/app/lib/privacy-settings';

export async function GET() {
  const settings = await getPrivacySettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const saved = await savePrivacySettings(body);
  return NextResponse.json(saved);
}
