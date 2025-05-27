// app/api/browse/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { simulateBrowsing } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  
  try {
    const result = await simulateBrowsing(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error browsing:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
}
