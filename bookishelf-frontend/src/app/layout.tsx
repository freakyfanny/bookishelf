'use client';

import { useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import Providers from "./providers";
import "./globals.css";
import React from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Header/>
          {children}
        </Providers>
        <footer className="flex row-start-3 gap-1 p-5">
          This is a footer
        </footer>
      </body>
    </html>
  );
}