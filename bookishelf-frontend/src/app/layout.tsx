'use client';

import { useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header onSearch={handleSearch} />
        <Providers>{children}</Providers>
        <footer className="flex row-start-3 gap-1 p-6">
          This is a footer
        </footer>
      </body>
    </html>
  );
}