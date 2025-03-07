interface BookCardProps {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    rating: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, description, imageUrl, category, rating }) => {
    return (
        <div className="sm:w-1/3 w-fit flex rounded m-2 shadow-lg bg-white flex-col sm:flex-row">
            <div
                className="h-48 sm:m-3 m-4 lg:h-64 lg:w-44 flex-none bg-contain bg-no-repeat rounded-t lg:rounded-t-none lg:rounded-l overflow-hidden"
                style={{ backgroundImage: `url(${imageUrl})` }}
                title={title}
            />
            
            <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-start leading-normal">
                <div className="flex items-start flex-col">
                    <div className="text-gray-900 font-bold text-left sm:text-xl text-md mb-2 sm:mt-0 -mt-6">
                        {title}
                    </div>

                    <div className="uppercase tracking-wide text-sm text-teal-600 font-bold">{category}</div>
                    <h2
                        className="block mt-1 text-lg leading-tight font-semibold text-black hover:underline"
                    >
                        {title}
                    </h2>
                    <p className="text-sm text-black mt-2">{description}</p>

                    <div className="flex flex-wrap">
                        <span
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2"
                        >
                            {category}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;