'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { useSearchQuery } from '../src/app/providers';
import { useDebounce } from "../hooks/useDebounce";

const Header: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchFilterValue, setSearchFilterValue] = useState("");
  const { setSearchQuery, setSearchFilter } = useSearchQuery();
  const debouncedValue = useDebounce(inputValue, 500);
  const debouncedFilterValue = useDebounce(searchFilterValue, 500);

  useEffect(() => {
    if (debouncedValue) {
      setSearchQuery(debouncedValue);
    }
  }, [debouncedValue, setSearchQuery]);

  useEffect(() => {
    if (debouncedFilterValue) {
      setSearchFilter(debouncedFilterValue);
    }
  }, [debouncedFilterValue, setSearchFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchFilterValue(e.target.value);
  };

  return (
    <header className="w-full fixed top-0 z-10 text-white p-0" >
      <nav className="flex items-center justify-between flex-wrap bg-slate-800 p-6" >
        <div className="flex items-center flex-shrink-0 text-white mr-6" >
          <span className="font-bold text-xl" > Bookishelf </span>
        </div>

        < div className="w-full block flex-grow sm:flex sm:items-center sm:w-auto" >
          <div className="text-sm sm:flex-grow" >
            <Link href="/" className="block mt-4 sm:inline-block sm:mt-0 text-sky-300 hover:text-white mr-4" >
              Bookishelf
            </Link>
            <Link href="/favourites" className="block mt-4 sm:inline-block sm:mt-0 text-sky-300 hover:text-white mr-4" >
              Favourites
            </Link>
          </div>

          <select
            value={searchFilterValue}
            onChange={handleFilterChange}
            className="bg-sky-300 text-black mx-4 px-4 py-2 rounded-md border border-gray-500 focus:border-sky-900"
          >
            <option value="books" > Books </option>
            <option value="authors" > Authors </option>
          </select>

          <div className="max-w-md mx-auto group" >
            <div className="flex items-center border-b-2 border-slate-200 group-focus-within:border-sky-500 transition-colors" >
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
  )
};

export default Header;
