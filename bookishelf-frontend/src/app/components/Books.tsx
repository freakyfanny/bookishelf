'use client';

import { useQuery } from '@tanstack/react-query';
import BookCard from './BookCard';

interface Book {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    link: string;
}

const fetchBooks = async (searchQuery: string) => {
    console.log("searchQuery ",searchQuery);
    const res = await fetch(`/api/search?searchParam=${searchQuery}`);
    if (!res.ok) {
        throw new Error('Error fetching books');
    }
    return res.json();
};

interface BooksProps {
    searchQuery: string;
}

const Books: React.FC<BooksProps> = ({ searchQuery }) => {
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['books', searchQuery],
        queryFn: () => fetchBooks(searchQuery),
        enabled: (searchQuery.length > 0)
    });

    if (isLoading) return <p>Loading...</p>;

    if (isError) {
        console.error(error); 
        return <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>;
    }

    console.log(data);

    const fetchedBooks: Book[] = data?.docs || []; // ändra om det behövs här

    return (
        <div className="container mt-5">
            <div className="md:flex">
                {fetchedBooks.map((book, index) => (
                    <BookCard
                        key={index}
                        title={book.title}
                        description={book.description}
                        imageUrl={book.imageUrl}
                        category={book.category}
                        link={book.link}
                    />
                ))}
            </div>
        </div>
    );
};

export default Books;