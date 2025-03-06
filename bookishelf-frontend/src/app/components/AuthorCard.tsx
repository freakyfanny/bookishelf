interface AuthorCardProps {
    name: string;
    imageUrl: string;
    topSubjects: string;
    topWork: string,
    birthDate: string,
    deathDate: string,
}

const BookCard: React.FC<AuthorCardProps> = ({ name, imageUrl, topSubjects, topWork, birthDate, deathDate }) => {
    console.log("name", name);
    return (
        <div className="flex-1 text-black text-center bg-white px-5 py-5 m-2 rounded">
            <div className="lg:flex lg:items-center">
                <div className="lg:flex-shrink-0">
                    <img className="rounded-lg lg:w-64" src={imageUrl} alt={name} />
                </div>
                <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="uppercase tracking-wide text-sm text-teal-600 font-bold">{topSubjects}</div>
                    <a
                        href="/"
                        className="block mt-1 text-lg leading-tight font-semibold text-black hover:underline"
                    >
                        {name}
                    </a>
                    <p className="text-sm text-black mt-2">{birthDate}</p>
                    <p className="text-sm text-black mt-2">{deathDate}</p>
                </div>
            </div>
        </div>
    );
};

export default BookCard;