import Image from "next/image";

interface BookCardProps {
    title: string;
    author: string;
    description: string;
    imageUrl: string;
    category: string;
    publishDate: number;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, description, imageUrl, category, publishDate }) => {
    return (
        <section
          role="link"
          tab-index="0"
          aria-labelledby={`book-${title}`}
          className="bg-gray-200 border-2 border-cyan-600 rounded-md cursor-pointer p-5 text-body-light"
        >
          <article className="flex">
            <figure className="self-center">
              <Image
                src={imageUrl}
                width={128}
                height={200}
                className="rounded shadow-lg border-b border-gray-300 object-cover transition-all duration-300"
                alt={`Book cover of ${title}`} // Descriptive alt text
              />
              <figcaption className="sr-only">{`Cover image for ${title}`}</figcaption>
            </figure>

            <section className="p-8 overflow-hidden">
              <header>
                <h2 className="text-lg font-bold">{title}</h2> {/* Heading for the title */}
              </header>

              <p className="text-balance font-normal">by {author}</p>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis font-normal">{publishDate}</p>
              <p className="uppercase tracking-wide text-sm text-teal-600 font-bold">{category}</p>

              <p className="text-sm text-black mt-2">{description}</p>
              <p className="text-sm text-black mt-2">{category}</p>

              <footer className="flex flex-wrap">
                <button
                  type="button"
                  aria-label={`Read more about ${title}`}
                  className="bg-cyan-600 shadow-lg shadow-cyan-500/50 text-white text-base font-semibold py-3 px-6 rounded-md shadow-sm
                             hover:bg-cyan-950 hover:shadow-md
                             focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4
                             focus-visible:ring-white focus-visible:ring-opacity-100
                             transition cursor-pointer"
                >
                  <span className="z-10">
                    Read more
                    <span className="sr-only"> about {title}</span>
                  </span>
                </button>
              </footer>
            </section>
          </article>
        </section>
    );
};

export default BookCard;