'use client';

import Link from "next/link";
import { useState, useEffect, useCallback } from 'react';
import { useSearchQuery } from '../providers'; // If you need the context for other purposes

const Header: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { setSearchQuery } = useSearchQuery(); // Keep this if you need to update the context value

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      setSearchQuery(query); // Update the search query in context
    },
    [setSearchQuery]
  );

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(inputValue);
    }, 1000);

    return () => clearTimeout(timeoutId); // Clear the timeout on input change
  }, [inputValue, debouncedSearch]);

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <header className="w-full fixed top-0 z-10 text-white p-0">
      <nav className="flex items-center justify-between flex-wrap bg-slate-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-bold text-xl">Bookishelf</span>
        </div>

        <div className="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
          <div className="text-sm sm:flex-grow">
            <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-sky-300 hover:text-white mr-4">
              Bookishelf
            </Link>
            <Link href="/favourites" className="block mt-4 sm:inline-block sm:mt-0 text-sky-300 hover:text-white mr-4">
              Favourites
            </Link>
          </div>
          
          <div className="max-w-md mx-auto group">
            <div className="flex items-center border-b-2 border-slate-200 group-focus-within:border-sky-500 transition-colors">
              <input 
                type="text" 
                value={inputValue}
                onChange={handleSearchChange} 
                placeholder="Type to search..." 
                className="w-full px-4 py-3 focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
