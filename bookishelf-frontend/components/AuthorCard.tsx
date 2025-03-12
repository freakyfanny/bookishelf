import { Author } from '../../shared/types';

interface AuthorCardProps {
    author: Author;
}

const BookCard: React.FC<AuthorCardProps> = ({ author }) => {
    const { name, birth_date, death_date, bio, top_subjects, top_work } = author;
    return (
        <div className="flex-1 text-black text-center bg-white px-5 py-5 m-2 rounded">
            <div className="lg:flex lg:items-center">
                <div className="mt-4 lg:mt-0 lg:ml-6">
                    <p className="block mt-1 text-lg leading-tight font-semibold text-black hover:underline">
                        {name}
                    </p>
                    {bio && <p className="block mt-1 text-lg leading-tight font-semibold text-black hover:underline">
                        {bio}
                    </p>}
                    <p className="text-sm text-black mt-2">{birth_date}</p>
                    <p className="text-sm text-black mt-2">{death_date}</p>

                    {top_work && <p className="block mt-1 text-lg leading-tight font-normal text-black">
                        {top_work}
                    </p>}
                    {top_subjects && top_subjects.length > 0 ? (
                        top_subjects.map((subject: string, index: number) => (
                            <div key={index} className="inline-flex text-md rounded overflow-hidden mr-2 mb-2">
                                <span className="px-2 leading-loose bg-cyan-500">
                                {subject}
                            </span>
                            </div>
                        ))
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default BookCard;