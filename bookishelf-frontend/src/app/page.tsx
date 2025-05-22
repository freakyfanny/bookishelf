import Search from "../../components/Search";
import type { Metadata } from "next";
import { Suspense } from 'react'
import NewBooksSlider from '../../components/NewBooksSlider';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Heading } from "../../components/Heading";

export const metadata: Metadata = {
  title: "Bookishelf",
  description: "Here you can search on books and find different books information",
};

export default function Page() {
  return (
    <main id="maincontent" className="p-5 mb-20 min-h-screen" role="main" tabIndex={-1}>
      <Heading level={1} id="search-results-heading" autoFocus>
        Bookishelf
      </Heading>
      <section aria-labelledby="search-results-heading">
        <Suspense fallback={<LoadingSpinner />}>
          <Search />
          <NewBooksSlider/>
        </Suspense>
      </section>
    </main>
  );
}
