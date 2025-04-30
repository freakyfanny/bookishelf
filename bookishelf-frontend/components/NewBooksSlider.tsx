'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Book } from '../../shared/types';
import LoadingSpinner from './LoadingSpinner';

const fetchNewBooks = async (): Promise<Book[]> => {
  const res = await fetch('/api/newBooks');
  if (!res.ok) {
    throw new Error('Failed to fetch new books');
  }
  return res.json();
};

export default function NewBooksSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data, error, isLoading, isError } = useQuery<Book[], Error>({
    queryKey: ['newBooks'],
    queryFn: fetchNewBooks,
    refetchInterval: 60000,
    enabled: true,
  });

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  useEffect(() => {
    if (books.length > 0) startAutoplay();
    return stopAutoplay;
  }, [books]);

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % books.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      setSelectedIndex((prev) => (prev + 1) % books.length);
      stopAutoplay();
    } else if (e.key === 'ArrowLeft') {
      setSelectedIndex((prev) => (prev - 1 + books.length) % books.length);
      stopAutoplay();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    console.error(error);
    return <p className="text-xl font-semibold mt-4 mb-4 py-2 text-red-700">An error occurred: {error instanceof Error ? error.message : 'Unknown error'}</p>;
  }

  if (books.length === 0) return <p>No new books available right now.</p>;

  const selectedBook = books[selectedIndex];

  return (
    <section className="flex flex-col items-center gap-4">
      <header className="w-full text-center mb-4">
        <h2 className="text-2xl font-semibold">New Books</h2>
      </header>

      <div className="w-full max-w-lg aspect-[2/3] relative">
        <Image
          src={selectedBook.imageUrl ?? '/placeholder-large.jpg'}
          alt={`Omslag för ${selectedBook.title}`}
          className="w-full h-full object-cover rounded-xl shadow"
          fill
        />
        <div className="absolute bottom-2 left-2 text-white bg-black/60 px-3 py-1 rounded text-sm" aria-live="polite">
          {selectedBook.title}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Navigate slides"
        onKeyDown={handleKeyDown}
        className="flex gap-2 overflow-x-auto focus:outline-none"
      >
        <button
          aria-label="Previous Book"
          onClick={() => {
            setSelectedIndex((prev) => (prev - 1 + books.length) % books.length);
            stopAutoplay();
          }}
          className="text-white text-2xl bg-blue-500 p-2 w-24 h-24 rounded hover:bg-blue-700"
        >
          ←
        </button>

        {books.map((book, index) => {
          const isSelected = selectedIndex === index;

          return (
            <button
              key={book.slug}
              role="tab"
              aria-label={`Slide ${index + 1}: ${book.title}`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => {
                setSelectedIndex(index);
                stopAutoplay();
              }}
              className={`rounded-lg outline-none focus-visible:ring-2 ring-offset-2 ring-blue-500 transition-opacity ${
                isSelected ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <Image
                src={book.imageUrl || '/placeholder-large.jpg'}
                alt=""
                aria-hidden="true"
                width={70}
                height={105}  // Adjust to match book cover aspect ratio (2:3)
                className="rounded shadow"
              />
            </button>
          );
        })}

        <button
          aria-label="Next Book"
          onClick={() => {
            setSelectedIndex((prev) => (prev + 1) % books.length);
            stopAutoplay();
          }}
          className="text-white text-2xl bg-blue-500 p-2 w-24 h-24 rounded hover:bg-blue-700"
        >
          →
        </button>
      </div>
    </section>
  );
}
