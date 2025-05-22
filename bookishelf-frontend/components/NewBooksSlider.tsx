/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Book } from "../../shared/types";
import LoadingSpinner from "./LoadingSpinner";
import { Heading } from "./Heading";

const fetchNewBooks = async (): Promise<Book[]> => {
  const res = await fetch("/api/newBooks");
  if (!res.ok) {
    throw new Error("Failed to fetch new books");
  }
  return res.json();
};

export default function NewBooksSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data, error, isLoading, isError } = useQuery<Book[], Error>({
    queryKey: ["newBooks"],
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
    if (e.key === "ArrowRight") {
      setSelectedIndex((prev) => (prev + 1) % books.length);
      stopAutoplay();
    } else if (e.key === "ArrowLeft") {
      setSelectedIndex((prev) => (prev - 1 + books.length) % books.length);
      stopAutoplay();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    console.error(error);
    return (
      <p className="text-xl font-semibold mt-4 mb-4 py-2 text-red-700">
        An error occurred:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (books.length === 0) return <p>No new books available right now.</p>;

  const selectedBook = books[selectedIndex];

  return (
    <section className="flex flex-col gap-4">
      <Heading level={2} autoFocus>
        New books
      </Heading>

      <div className="w-full max-w-lg relative">
        <img
          src={
            selectedBook.imageUrl ??
            "https://placehold.co/70x105?text=Cover+image+missing"
          }
          alt={`Omslag för ${selectedBook.title}`}
          className="aspect-[2/3] h-[30vh] object-cover rounded-xl shadow"
        />
      </div>

      <div className="mt-3 space-y-1 text-sm" aria-live="polite">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {selectedBook.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 italic">
          {selectedBook.authors}
        </p>
        {selectedBook.description && (
          <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
            {typeof selectedBook.description === "string"
              ? selectedBook.description
              : selectedBook.description.value}
          </p>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Navigate slides"
        onKeyDown={handleKeyDown}
        className="flex gap-2 p-2 overflow-x-auto focus:outline-none"
      >
        <button
          aria-label="Previous Book"
          onClick={() => {
            setSelectedIndex(
              (prev) => (prev - 1 + books.length) % books.length
            );
            stopAutoplay();
          }}
          className="text-white text-2xl bg-blue-500 p-1 w-24 h-24 rounded hover:bg-blue-700 focus-style"
        >
          ←
        </button>

        {books.map((book, index) => {
          const isSelected = selectedIndex === index;

          return (
            <button
              key={`${book.slug}: Slide ${index}`}
              role="tab"
              aria-label={`Slide ${index + 1}: ${book.title}`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => {
                setSelectedIndex(index);
                stopAutoplay();
              }}
              className={`rounded-lg outline-none focus-visible:ring-2 ring-offset-2 ring-blue-500 transition-opacity ${
                isSelected ? "ring-2 ring-blue-600" : "opacity-90 grayscale"
              }`}
            >
              <img
                src={book.imageUrl || "https://placehold.co/70x105"}
                alt={`Omslag för ${book.title}`}
                width={70}
                height={105}
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
          className="text-white text-2xl bg-blue-500 p-1 w-24 h-24 rounded hover:bg-blue-900"
        >
          →
        </button>
      </div>
    </section>
  );
}
