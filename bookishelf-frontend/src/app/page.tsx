import Books from "./components/Books";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookishelf",
  description: "Here you can search on books and find different books information",
};

export default function BooksPage() {
  return (
    <div>
      <main className="p-5">
        <h1>Böcker</h1>
        <Books />
      </main>
    </div>
  );
}
