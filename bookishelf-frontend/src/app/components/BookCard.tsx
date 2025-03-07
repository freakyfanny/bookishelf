interface BookCardProps {
    title: string;
    author: string;
    description: string;
    imageUrl: string;
    category: string;
    rating: number;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, description, imageUrl, category, rating }) => {
    return (
        <div className="mt-5 bg-white h-[270px] shadow-lg rounded-md flex flex-col cursor-pointer px-5 pb-5 text-body-light">
            <div className="flex relative">
                <img
                    className="w-40 h-58 -mt-9 rounded shadow-lg border-b border-gray-300 object-cover mb-5 transition-all duration-300"
                    src={imageUrl}
                    alt={title}
                    title={title}
                />

                <div className="p-8 overflow-hidden relative">
                        <div className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                            {title}
                        </div>
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis font-normal">by {author}</div>
                        <div className="uppercase tracking-wide text-sm text-teal-600 font-bold">{category}</div>

                        <p className="text-sm text-black mt-2">{description}</p>

                        <div className="flex flex-wrap">
                            
                                {category}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;