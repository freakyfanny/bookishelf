import Search from "../../components/Search";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookishelf",
  description: "Here you can search on books and find different books information",
};

export default function Page() {
  return (
    <main id="maincontent" className="p-5 mb-20 min-h-screen" role="main" tabIndex={-1}>
      <h1 className="text-2xl font-bold" id="search-results-heading">
        Welcome to Bookishelf, your own bookipedia where you can search for books.
      </h1>
      <section aria-labelledby="search-results-heading">
        <Search />
      </section>
    </main>
  );
}
