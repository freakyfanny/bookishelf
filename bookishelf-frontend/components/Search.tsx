"use client";

import { useQuery } from "@tanstack/react-query";
import BookCard from "./BookCard";
import AuthorCard from "./AuthorCard";
import { useSearchQuery } from "../src/app/providers";
import { useState, useEffect, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useDebounce } from "../hooks/useDebounce";
import SearchFilter from "./SearchFilter";
import { Book, Author } from "../../shared/types";

const RESULTS_LIMIT = 10;

const fetchResults = async (
  searchQuery: string,
  filter: string,
  offset: number
): Promise<(Book | Author)[]> => {
  const res = await fetch(
    `/api/search?searchParam=${searchQuery}&filter=${filter}&limit=${RESULTS_LIMIT}&offset=${offset}`
  );
  if (!res.ok) {
    throw new Error("Error fetching results");
  }
  return res.json();
};

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchFilterValue, setSearchFilterValue] = useState("");
  const [results, setResults] = useState<(Book | Author)[]>([]);
  const [offset, setOffset] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const resultsRef = useRef<HTMLUListElement>(null);

  const { searchQuery, searchFilter } = useSearchQuery();
  const { setSearchQuery, setSearchFilter } = useSearchQuery();

  const debouncedValue = useDebounce(inputValue, 500);
  const debouncedFilterValue = useDebounce(searchFilterValue, 500);

  const { data, error, isLoading, isError } = useQuery<
    (Book | Author)[],
    Error
  >({
    queryKey: ["results", searchQuery, searchFilter],
    queryFn: () => fetchResults(searchQuery, searchFilter, 0),
    enabled: searchQuery.length > 1 && typeof window !== "undefined",
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (data) {
      setResults(data);
      setOffset(data.length);
    }
  }, [data]);

  useEffect(() => {
    if (debouncedValue) setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  useEffect(() => {
    if (debouncedFilterValue) setSearchFilter(debouncedFilterValue);
  }, [debouncedFilterValue, setSearchFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSearchFilterValue(e.target.value);

  const loadMore = async () => {
    setIsFetchingMore(true);
    try {
      const newResults = await fetchResults(searchQuery, searchFilter, offset);
      setResults((prev) => [...prev, ...newResults]);
      setOffset((prev) => prev + newResults.length);
    } catch (err) {
      console.error("Error loading more:", err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      loadMore();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    console.error(error);
    return (
      <p className="text-xl font-semibold mt-4 mb-4 py-2 text-red-800">
        An error occurred:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  if (!isHydrated) return null;

  return (
    <section aria-labelledby="search-heading" className="py-4">
      <h2 id="search-heading" className="text-xl font-bold mb-6">
        Search books
      </h2>

      <form
        role="search"
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
        aria-label="Search form"
      >
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
            className="text-sm px-4 py-2 bg-white text-black rounded-md border border-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-900"
            aria-required="true"
          />
        </div>
      </form>

      {results.length > 0 && (
        <div aria-label="Search results">
          <ul
            ref={resultsRef}
            className="grid grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-10"
            role="list"
          >
            {results.map((object, idx) =>
              searchFilter === "books" && "title" in object ? (
                <li key={`${object.slug}-${idx}`}>
                  <BookCard
                    type={object.type}
                    slug={object.slug}
                    title={object.title}
                    description={
                      typeof object.description === "string"
                        ? object.description
                        : object.description?.value || ""
                    }
                    authors={object.authors}
                    imageUrl={object.imageUrl || ""}
                    subjects={object.subjects || []}
                    first_publish_year={object.first_publish_year || 0}
                  />
                </li>
              ) : (
                <li key={`${object.slug}-${idx}`}>
                  <AuthorCard author={object as Author} />
                </li>
              )
            )}
          </ul>

          <div className="mt-6">
            <button
              onClick={loadMore}
              onKeyDown={handleKeyDown}
              disabled={isFetchingMore}
              className="mt-4 px-6 py-2 bg-sky-900 text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300"
              aria-label="Load more search results"
            >
              {isFetchingMore ? "Loading more..." : "Load more"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Search;
