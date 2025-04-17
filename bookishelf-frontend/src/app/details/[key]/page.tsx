import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookDetails } from "../../../../../shared/types";

interface DescriptionLink {
  href: string;
  text: string;
}

function extractLinks(text: string): { text: string; links: DescriptionLink[] } {
  const linkRegex = /(http[^\s]+)/g;
  const markdownLinkRegex = /\[([^\]]+)\]\s?\[([^\]]+)\]\s?:\s?(https?:\/\/[^\s]+)/g;
  const links: DescriptionLink[] = [];
  let match;

  // Collect all links from markdown-style citations
  text = text.replace(markdownLinkRegex, (match, linkText, linkId, url) => {
    links.push({
      href: url,
      text: linkText || url, // Use linkText if available, otherwise the URL
    });
    return ''; // Remove the citation from the text
  });

  // Collect all regular URLs
  while ((match = linkRegex.exec(text)) !== null) {
    links.push({
      href: match[0],
      text: match[0],
    });
  }

  return {
    text: text.replace(linkRegex, ""), // Remove any remaining links (if any)
    links,
  };
}

async function fetchBookDetails(key: string): Promise<BookDetails | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/api/bookDetails?key=${key}`, {
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

  const { text: cleanDescription, links: descriptionLinks } = extractLinks(description.value);

  const { text: cleanAuthorBio, links: authorLinks } = extractLinks(author?.bio || "");

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <article
        aria-labelledby="book-title"
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <header className="mb-6">
          <h1
            id="book-title"
            className="text-4xl font-extrabold text-gray-900 leading-tight"
          >
            {title}
          </h1>
          <p className="text-sm text-gray-600">{first_publish_date}</p>
        </header>
  
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <Image
              src={imageUrl || "/placeholder.png"}
              alt={`Cover image of the book ${title}`}
              width={300}
              height={450}
              className="rounded-lg shadow-lg object-cover w-full"
              priority
            />
          </div>
  
          <div className="w-full md:w-2/3">
            <section aria-labelledby="book-description">
              <h2 id="book-description" className="sr-only">Book Description</h2>
              <div className="space-y-4">
                <details className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <summary className="cursor-pointer text-2xl font-bold text-gray-900 hover:text-blue-600 focus:ring-2 focus:ring-blue-600">
                    Description
                  </summary>
                  <p className="text-gray-800 text-base leading-relaxed">
                    {cleanDescription || "No description available"}
                  </p>
                </details>

                <details className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <summary className="cursor-pointer text-2xl font-bold text-gray-900 hover:text-blue-600 focus:ring-2 focus:ring-blue-600">
                    Author Information
                  </summary>
                  {author ? (
                    <>
                      <p className="text-gray-700">{cleanAuthorBio || "No biography available"}</p>
                      {authorBioUrl && (
                        <Link
                          href={authorBioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          aria-label={`Learn more about ${author.name}`}
                        >
                          Learn more about {author.name}
                        </Link>
                      )}
                      {authorLinks.length > 0 && (
                        <ul className="list-disc pl-5">
                          {authorLinks.map((link, index) => (
                            <li key={index}>
                              <Link
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                              >
                                {link.text}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p>Information not available</p>
                  )}
                </details>

                <details className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <summary className="cursor-pointer text-2xl font-bold text-gray-900 hover:text-blue-600 focus:ring-2 focus:ring-blue-600">
                    Subjects
                  </summary>
                  <p>{subjects?.join(", ") || "No categories available"}</p>
                </details>

                {descriptionLinks.length > 0 && (
                  <details className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <summary className="cursor-pointer text-2xl font-bold text-gray-900 hover:text-blue-600 focus:ring-2 focus:ring-blue-600">
                      Sources
                    </summary>
                    <ul className="list-disc pl-5">
                      {descriptionLinks.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          >
                            {link.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </section>
          </div>
        </div>
      </article>
  
      <div className="mt-8">
        <Link
          href="/"
          className="inline-block text-cyan-700 hover:text-cyan-900 font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
          aria-label="Return to search results"
        >
          ← Back to search
        </Link>
      </div>
    </main>
  );
}
