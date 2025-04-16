import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookDetails } from "../../../../../shared/types";

async function fetchBookDetails(key: string): Promise<BookDetails | null> {
  try { 
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res =await fetch(`${apiUrl}/api/bookDetails?key=${key}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch book details:", error);
    return null;
  }
}

type keyParams = Promise<{ key: string }>;

export default async function BookDetailsPage(props: { params: keyParams }) {
  const { key } = await props.params;
  const data = await fetchBookDetails(key);

  if (!data) {
    return notFound();
  }

  const {
    title,
    authors,
    description,
    imageUrl,
    subjects,
    first_publish_date,
  } = data;

  const author = authors && authors.length > 0 ? authors[0] : null;

  const authorBioUrl = author?.bio ? author.bio.match(/http[^\s]+/)?.[0] : null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <article
        aria-labelledby="book-title"
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <header className="mb-6">
          <h1 id="book-title" className="text-3xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-gray-700 text-lg mt-1">
            by {author ? (
              <>
                <span className="font-semibold">{author.name}</span>
                <br />
                <span className="text-sm">{author.bio}</span>
                {authorBioUrl && (
                  <Link
                    href={authorBioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                    aria-label={`Learn more about ${author.name}`}
                  >
                    Learn more about {author.name}
                  </Link>
                )}
              </>
            ) : (
              'Unknown Author'
            )}
          </p>
          <p className="text-sm text-gray-600">{first_publish_date}</p>
          <p className="mt-1 text-sm text-teal-600 uppercase font-semibold">
            {subjects?.[0] ?? "No category"}
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <Image
              src={imageUrl || "/placeholder.png"}
              alt={`Book cover of ${title}`}
              width={300}
              height={450}
              className="rounded-lg shadow-lg object-cover w-full"
              priority
            />
          </div>

          <div className="w-full md:w-2/3">
            <section aria-label="Book Description">
              <h2 className="sr-only">Book Description</h2>
              <p className="text-gray-800 text-base leading-relaxed">
                {typeof description === "string" ? description : description?.value ?? "No description"}
              </p>
            </section>
          </div>
        </div>
      </article>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block text-cyan-700 hover:text-cyan-900 font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
        >
          ← Back to search
        </Link>
      </div>
    </main>
  );
}
