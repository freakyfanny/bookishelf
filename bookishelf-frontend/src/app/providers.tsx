"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const SearchQueryContext = createContext<{ 
  searchQuery: string; 
  setSearchQuery: (query: string) => void; 
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
} | undefined>(undefined);

export const useSearchQuery = () => {
  const context = useContext(SearchQueryContext);
  if (!context) {
    throw new Error("useSearchQuery must be used within a Providers component");
  }
  return context;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("books"); // Default till "books"

  return (
    <QueryClientProvider client={queryClient}>
      <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery, searchFilter, setSearchFilter }}>
        <div className="mt-25">{children}</div>
      </SearchQueryContext.Provider>
    </QueryClientProvider>
  );
}
