import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.BACKEND_API_URL;
    console.log(`${apiUrl}/newBooks`);

    const res = await fetch(`${apiUrl}/newBooks`);
    if (!res.ok) {
      throw new Error('New books API failed');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in newBooks handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
