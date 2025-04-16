'use client';

import { useQuery } from '@tanstack/react-query';
import BookCard from './BookCard';
import AuthorCard from './AuthorCard';
import { useSearchQuery } from "../src/app/providers";
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useDebounce } from "../hooks/useDebounce";
import SearchFilter from './SearchFilter';
import { Book, Author } from '../../shared/types';

const fetchResults = async (searchQuery: string, filter: string): Promise<(Book | Author)[]> => {
  const res = await fetch(`/api/search?searchParam=${searchQuery}&filter=${filter}`);
  if (!res.ok) {
    throw new Error('Error fetching results');
  }
  return res.json();
};

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchFilterValue, setSearchFilterValue] = useState("");
  const { searchQuery, searchFilter } = useSearchQuery();
  const { setSearchQuery, setSearchFilter } = useSearchQuery();

  const { data, error, isLoading, isError } = useQuery<(Book | Author)[], Error>({
    queryKey: ['results', searchQuery, searchFilter],
    queryFn: () => fetchResults(searchQuery, searchFilter),
    enabled: searchQuery.length > 1
  });

  const debouncedValue = useDebounce(inputValue, 500);
  const debouncedFilterValue = useDebounce(searchFilterValue, 500);

  useEffect(() => {
    if (debouncedValue) setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  useEffect(() => {
    if (debouncedFilterValue) setSearchFilter(debouncedFilterValue);
  }, [debouncedFilterValue, setSearchFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSearchFilterValue(e.target.value);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    console.error(error);
    return <p className="text-xl font-semibold mt-4 mb-4 py-2 text-red-700">An error occurred: {error instanceof Error ? error.message : 'Unknown error'}</p>;
  }

  const fetchedResult = Array.isArray(data) ? data : [];

  return (
    <section aria-labelledby="search-heading" className="py-4">
      <h2 id="search-heading" className="text-xl font-bold mb-6">
        Search books
      </h2>

      <form role="search" className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <SearchFilter
          searchFilterValue={searchFilterValue}
          handleFilterChange={handleFilterChange}
        />

        <div className="w-full flex flex-col gap-2 sm:max-w-md">
          <label htmlFor="book-search" className="text-black font-semibold">
            Search phrase
          </label>
          <input
            id="book-search"
            type="text"
            value={inputValue}
            onChange={handleSearchChange}
            placeholder="Type to search..."
            className="text-sm px-4 py-2 bg-white text-black rounded-md border border-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-900"
          />
        </div>
      </form>
      {fetchedResult.length > 0 && (
        <div aria-label="Search results">
          <ul className="grid grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-10">
            {fetchedResult.map((object) => {

              return searchFilter === "books" && 'title' in object ? (
                <li key={`${object.slug}`}>
                  <BookCard
                    type={object.type}
                    slug={object.slug}
                    title={object.title}
                    description={typeof object.description === 'string' ? object.description : object.description?.value || ''}
                    authors={object.authors}
                    imageUrl={object.imageUrl || ''}
                    subjects={object.subjects || []}
                    first_publish_year={object.first_publish_year || 0}
                  />
                </li>
              ) : (
                <li id={object.slug}>
                  <AuthorCard author={object as Author} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Search;