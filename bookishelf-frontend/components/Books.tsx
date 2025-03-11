'use client';

import { useQuery } from '@tanstack/react-query';
import BookCard from './BookCard';
import AuthorCard from './AuthorCard';
import { useSearchQuery } from "../src/app/providers";

const fetchBooks = async (searchQuery: string) => {
    const res = await fetch(`/api/search?searchParam=${searchQuery}`);
    if (!res.ok) {
        throw new Error('Error fetching books');
    }
    return res.json();
};

const Books = () => {
    const { searchQuery } = useSearchQuery();
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['books', searchQuery],
        queryFn: () => fetchBooks(searchQuery),
        enabled: (searchQuery.length > 1)
    });

    if (isLoading) return (<div className="flex flex-col items-center">
        <p className="text-4xl font-normal mt-4 mb-4 py-2">Loading</p>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" stroke="currentColor" stroke-width="4" cx="12" cy="12" r="10"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg></div>)
        ;

    if (isError) {
        console.error(error);
        return <p className="text-3xl font-semibold mt-4 mb-4 py-2">An error occured: {error instanceof Error ? error.message : 'Unknown error'}</p>;
    }

    const fetchedResult = Array.isArray(data) ? data : [];

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 pt-10 relative">
            {fetchedResult.map((object, index) =>
                (object.type = "book") ? <BookCard
                    key={index}
                    title={object.title}
                    description={object.description}
                    author={object.author ? object.author.join(', ') : ""}
                    imageUrl={object.imageUrl}
                    category={object.subjects}
                    publishDate={object.first_publish_year}
                /> : <AuthorCard
                    key={index}
                    name={object.name}
                    bio={object.bio}
                    birthDate={object.birth_date} deathDate={object.death_date} />
            )}
        </div>
    );
};

export default Books;