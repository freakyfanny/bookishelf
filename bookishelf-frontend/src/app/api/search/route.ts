import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParam = url.searchParams.get('searchParam');
    const filter = url.searchParams.get('filter');
    const limit = url.searchParams.get('limit') || '10'; // Default to 10 if not provided
    const offset = url.searchParams.get('offset') || '0'; // Default to 0 if not provided

    if (!searchParam) {
      return NextResponse.json({ error: 'Missing searchParam' }, { status: 400 });
    }

    if (!filter) {
      return NextResponse.json({ error: 'Missing filter' }, { status: 400 });
    }

    const serverResponse = await fetch(`http://localhost:3000/search?searchParam=${searchParam}&limit=${limit}&offset=${offset}&filter=${filter}`);
    
    if (!serverResponse.ok) {
      throw new Error('Server API error');
    }

    const data = await serverResponse.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Server:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}