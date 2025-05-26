interface AuthorCardProps {
    name: string;
    bio: string;
    birthDate: string,
    deathDate: string,
}

const BookCard: React.FC<AuthorCardProps> = ({ name, bio, birthDate, deathDate }) => {
//WIP
    return (
        <div className="flex-1 text-black text-center bg-white px-5 py-5 m-2 rounded">
            <div className="lg:flex lg:items-center">
                <div className="mt-4 lg:mt-0 lg:ml-6">
                    <p className="block mt-1 text-lg leading-tight font-semibold text-black hover:underline">
                        {name}
                    </p>
                    <p className="block mt-1 text-lg leading-tight font-semibold text-black hover:underline">
                        {bio}
                    </p>
                    <p className="text-sm text-black mt-2">{birthDate}</p>
                    <p className="text-sm text-black mt-2">{deathDate}</p>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
