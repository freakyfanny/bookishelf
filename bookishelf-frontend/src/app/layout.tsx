'use client';

import { useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className='min-h-screen'>
          <Providers>
            <Header />
            {children}
          </Providers>
          <Footer />
        </div>
      </body>
    </html>
  );
}