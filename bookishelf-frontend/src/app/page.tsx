import Books from "./components/Books";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookishelf",
  description: "Here you can search on books and find different books information",
};

export default function BooksPage() {
  return (
    <div>
      <main className="px-5 py-10 mb-20">
        <h1 className="text-2xl font-bold">Result</h1>
        <Books />
      </main>
    </div>
  );
}
