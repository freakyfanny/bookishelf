'use client';

import { useQuery } from '@tanstack/react-query';
import BookCard from './BookCard';
import AuthorCard from './AuthorCard';

interface Book {
    type: string;
    key: string;
    title: string;
    author: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    topSubjects: string;
    topWork: string;
    birthDate: string;
    deathDate: string;
    publishDate: number;
    link: string;
}

const fetchBooks = async (searchQuery: string) => {
    console.log("searchQuery ", searchQuery);
    const res = await fetch(`/api/search?searchParam=${searchQuery}`);
    if (!res.ok) {
        throw new Error('Error fetching books');
    }
    return res.json();
};

import { useSearchQuery } from "../providers"; // Import the hook to access search query

const Books = () => {
    const { searchQuery } = useSearchQuery(); // Access searchQuery from context
    console.log("searchQuery is", searchQuery)
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['books', searchQuery],
        queryFn: () => fetchBooks(searchQuery),
        enabled: (searchQuery.length > 1)
    });

    if (isLoading) return <p>Loading...</p>;

    if (isError) {
        console.error(error);
        return <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>;
    }

    console.log('data', data);

    const fetchedBooks: Book[] = data === undefined ? [] : data; // ändra om det behövs här
    console.log('data', data);
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10 pt-10 relative">
            {fetchedBooks.map((book, index) =>
                (book.type = "book") ? <BookCard
                    key={index}
                    title={book.title}
                    description={book.description}
                    author={book.author}
                    imageUrl={book.imageUrl}
                    category={book.category}
                    publishDate={book.publishDate}
                /> : <AuthorCard
                    key={index}
                    name={book.name}
                    topSubjects={book.topSubjects}
                    topWork={book.topWork}
                    imageUrl={book.imageUrl} birthDate={book.birthDate} deathDate={book.deathDate} />
            )}
        </div>
    );
};

export default Books;