interface BookCardProps {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    link: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, description, imageUrl, category, link }) => {
    return (
        <div className="flex-1 text-black text-center bg-white px-5 py-5 m-2 rounded">
            <div className="lg:flex lg:items-center">
                <div className="lg:flex-shrink-0">
                    <img className="rounded-lg lg:w-64" src={imageUrl} alt={title} />
                </div>
                <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="uppercase tracking-wide text-sm text-teal-600 font-bold">{category}</div>
                    <a
                        href={link}
                        className="block mt-1 text-lg leading-tight font-semibold text-black hover:underline"
                    >
                        {title}
                    </a>
                    <p className="text-sm text-black mt-2">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default BookCard;