'use client';

import { createContext, useContext, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const SearchQueryContext = createContext<{ searchQuery: string, setSearchQuery: (query: string) => void } | undefined>(undefined);

export const useSearchQuery = () => {
  const context = useContext(SearchQueryContext);
  if (!context) {
    throw new Error('useSearchQuery must be used within a SearchQueryProvider');
  }
  return context;
};

export const SearchQueryProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SearchQueryProvider>
      <QueryClientProvider client={queryClient}>
        <div className="mt-25">
          {children}
        </div>
      </QueryClientProvider>
    </SearchQueryProvider>
  );
}