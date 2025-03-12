'use client';

import { useQuery } from '@tanstack/react-query';
import BookCard from './BookCard';
import AuthorCard from './AuthorCard';
import { useSearchQuery } from "../src/app/providers";
import LoadingSpinner from './LoadingSpinner';

const fetchResults = async (searchQuery: string, filter: string) => {
    const res = await fetch(`/api/search?searchParam=${searchQuery}&filter=${filter}`);
    if (!res.ok) {
        throw new Error('Error fetching results');
    }
    return res.json();
};

const Books = () => {
    const { searchQuery, searchFilter } = useSearchQuery();
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['results', searchQuery, searchFilter],
        queryFn: () => fetchResults(searchQuery, searchFilter),
        enabled: (searchQuery.length > 1)
    });

    if (isLoading) return (
        <LoadingSpinner />
    );

    if (isError) {
        console.error(error);
        return <p className="text-3xl font-semibold mt-4 mb-4 py-2">An error occurred: {error instanceof Error ? error.message : 'Unknown error'}</p>;
    }

    const fetchedResult = Array.isArray(data) ? data : [];

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 pt-10 relative">
            {fetchedResult.map((object, index) =>
                searchFilter === "books" ? (
                    <BookCard
                        key={index}
                        title={object.title}
                        description={object.description}
                        author={object.author ? object.author.join(', ') : ""}
                        imageUrl={object.imageUrl}
                        category={object.subjects}
                        publishDate={object.first_publish_year}
                    />
                ) : (
                    <AuthorCard
                        key={index}
                        author={object}
                    />
                )
            )}
        </div>
    );
};

export default Books;