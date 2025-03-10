'use client';

import Link from "next/link";
import { useSearchQuery } from "../providers"; 
import { useState, useEffect } from "react";

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery); 
    }, 1000);

    return () => clearTimeout(timeoutId); 
  }, [searchQuery]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); 
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
                value={searchQuery}
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
