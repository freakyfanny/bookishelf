import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    const res = await fetch(`http://localhost:3000/bookDetails?key=${key}`);
    if (!res.ok) {
      throw new Error('Book details API failed');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in bookDetails handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
