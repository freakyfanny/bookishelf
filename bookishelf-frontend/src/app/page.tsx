"use client";
import Books from "./components/Books";
import { useState, useEffect } from 'react';
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Bookishelf",
//   description: "Here you can search on books and find different books information",
// };

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  }, []);
  
  return (
    <div>
      <main>
        <h1>Böcker</h1>
        <Books searchQuery="harry" />
      </main>
    </div>
  );
}
