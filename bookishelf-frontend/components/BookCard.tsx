import Image from "next/image";
import Link from "next/link";
import { Book } from "../../shared/types";

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BookCard: React.FC<Book> = ({
  slug,
  title,
  authors,
  description,
  imageUrl,
  subjects,
  first_publish_year,
}) => {
  const slugTitle = slugify(title);

  return (
    <section
      role="link"
      tabIndex={0}
      aria-labelledby={`book-${slugTitle}`}
      className="bg-gray-200 border-2 border-cyan-600 rounded-md cursor-pointer p-5 text-body-light"
    > 
      <article className="flex">
        <figure className="self-center">
          <Image
            src={imageUrl || "/placeholder.png"}
            width={128}
            height={200}
            className="rounded shadow-lg border-b border-gray-300 object-cover transition-all duration-300"
            alt={`Book cover of ${title}`}
          />
          <figcaption className="sr-only">{`Cover image for ${title}`}</figcaption>
        </figure>

        <section className="p-8 overflow-hidden">
          <header>
            <h2 className="text-lg font-bold">{title}</h2>
          </header>

          <p className="text-balance font-normal">by {authors}</p>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis font-normal">{first_publish_year}</p>
          <p className="uppercase tracking-wide text-sm text-teal-600 font-bold">
            {subjects?.[0] ?? "Unknown Category"}
          </p>
          <p className="text-sm text-black mt-2">
            {typeof description === "string" ? description : description?.value ?? "No description"}
          </p>

          <footer className="flex flex-wrap mt-4">
            <Link
              href={slug.replace("works/", "details/")} // key already includes "/works/..."
              aria-label={`Read more about ${title}`}
              className="bg-cyan-600 shadow-lg shadow-cyan-500/50 text-white text-base font-semibold py-3 px-6 rounded-md shadow-sm
                         hover:bg-cyan-950 hover:shadow-md
                         focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4
                         focus-visible:ring-white focus-visible:ring-opacity-100
                         transition cursor-pointer"
            >
              Read more<span className="sr-only"> about {title}</span>
            </Link>
          </footer>
        </section>
      </article>
    </section>
  );
};

export default BookCard;
