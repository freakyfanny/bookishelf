import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import dotenv from "dotenv";
import { request } from "undici";
import cors from "@fastify/cors";
import { Author, Book } from "../shared/types";

dotenv.config();

const fastifyServer = fastify({
  logger: process.env.NODE_ENV === "development" ? { level: "debug" } : { level: "info" },
});

fastifyServer.register(cors, {
  origin: "*",
});

const url = "https://openlibrary.org";
const PORT = process.env.PORT || 3000;

interface QueryWithIdType {
  id: string;
  type: string;
}

interface QueryWithKey {
  key: string;
}

interface QueryWithSearchParamLimitOffsetFilter {
  searchParam: string;
  limit: string;
  offset: string;
  filter: string;
}

// Fetch Book Details
fastifyServer.get(
  "/bookDetails",
  async (req: FastifyRequest<{ Querystring: QueryWithKey }>, reply: FastifyReply) => {
    try {
      const { key } = req.query;

      if (!key) {
        return reply.status(400).send({ error: "Query parameter 'key' is required." });
      }

      const result: Book | undefined = await fetchBook(key);

      if (!result) {
        return reply.status(404).send({ error: "Book details not found." });
      }

      return reply.send(result);
    } catch (err) {
      console.error(`Error in /bookDetails route: ${err}`);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Fetch Author Details
fastifyServer.get(
  "/authordetails",
  async (req: FastifyRequest<{ Querystring: QueryWithKey }>, reply: FastifyReply) => {
    try {
      const { key: authorId } = req.query;

      if (!authorId) {
        return reply.status(400).send({ error: "Query parameter 'key' is required." });
      }

      const response = await fetch(`${url}/authors/${authorId}.json`);

      if (!response.ok) {
        return reply.status(response.status).send({ error: `Failed to fetch author details. ${response.statusText}` });
      }

      const result: Author = await response.json();

      if (!result) {
        return reply.status(404).send({ error: "Author details not found." });
      }

      return reply.send(result);
    } catch (err) {
      console.error(`Error in /authorDetails route: ${err}`);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
);

function isValidFilter(value: string): value is "books" | "authors" {
  return value === "books" || value === "authors";
}

// Search Book or Author
fastifyServer.get(
  "/search",
  async (
    req: FastifyRequest<{ Querystring: QueryWithSearchParamLimitOffsetFilter }>,
    reply: FastifyReply
  ) => {
    try {
      const { searchParam, limit, offset, filter } = req.query;


      if (!searchParam) {
        return reply.status(400).send({ error: "Query parameter 'searchParam' is required." });
      }

      if (limit && isNaN(Number(limit))) {
        return reply.status(400).send({ error: "Query parameter 'limit' must be a valid number." });
      }

      if (offset && isNaN(Number(offset))) {
        return reply.status(400).send({ error: "Query parameter 'offset' must be a valid number." });
      }

      if (filter && !["books", "authors"].includes(filter)) {
        return reply.status(400).send({ error: "Query parameter 'filter' must be either 'books' or 'authors'." });
      }

      const filterParam = isValidFilter(filter) ? filter : undefined;
      const result = await fetchSearchResults(searchParam, limit, offset, filterParam);
      if (!result || result.length === 0) {
        return reply.status(404).send({ error: `No results found for the given search query and filter: '${filter}'` });
      }

      return reply.send(result);
    } catch (err) {
      console.error(`Error in /search route: ${err}`);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
);
type SearchResponse<T> = {
  docs: T[];
};

const fetchSearchResults = async (
  query: string,
  limit?: string,
  offset?: string,
  filter?: "books" | "authors"
): Promise<(Book | Author)[]> => {
  try {
    if (!filter) {
      throw new Error("Missing required filter: must be either 'books' or 'authors'");
    }

    let results: (Book | Author)[] = [];

    if (filter === "books") {
      const responseBooks = await request(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`,
        { method: "GET" }
      );

      const bookData = (await responseBooks.body.json()) as SearchResponse<any>;

      results = bookData.docs.map((book: any): Book => ({
        type: "book",
        slug: book.key,
        title: book.title,
        authors: book.author_name?.join(", ") || "Unknown Author",
        cover_id: book.cover_i,
        first_publish_year: book.first_publish_year,
        subjects: book.subject,
        description: book.description,
        imageUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : undefined,
      }));
    }

    if (filter === "authors") {
      const responseAuthors = await request(
        `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
        { method: "GET" }
      );

      const authorData = (await responseAuthors.body.json()) as SearchResponse<any>;

      results = authorData.docs.map((author: any): Author => ({
        type: "author",
        slug: author.key,
        name: author.name,
        birth_date: author.birth_date,
        death_date: author.death_date,
        bio: author.bio,
        top_work: author.top_work,
        top_subjects: author.top_subjects,
      }));
    }

    const parsedLimit = limit ? parseInt(limit) : results.length;
    const parsedOffset = offset ? parseInt(offset) : 0;
    const end = parsedLimit + parsedOffset;

    return results.slice(parsedOffset, end);
  } catch (err) {
    console.error(`Error in search: ${err}`);
    throw err;
  }
};

const fetchBook = async (key: string): Promise<Book | undefined> => {
  try {
    const requestUrl = `https://openlibrary.org/works/${key}.json`;
    const response = await fetch(requestUrl, { method: "GET" });

    if (!response.ok) {
      console.error(`Failed to fetch data for ${key}: ${response.statusText}`);
      return undefined;
    }

    const result: any = await response.json();

    if (result) {
      const bookData = result;

      // Fetch author information
      if (bookData.authors && bookData.authors.length > 0) {
        const authorPromises = bookData.authors.map(async (author: any) => {
          const authorUrl = `https://openlibrary.org/${author.author.key}.json`; // Corrected URL for author data
          const authorResponse = await fetch(authorUrl);
          
          if (authorResponse.ok) {
            const authorData = await authorResponse.json();
            return {
              name: authorData.name,
              bio: authorData.bio || 'No biography available',
              key: authorData.key,
            };
          } else {
            console.error(`Failed to fetch author data for ${author.key}`);
            return { name: author.name || 'Unknown', bio: 'No biography available', key: author.key };
          }
        });

        // Wait for all author data to be fetched
        const authors = await Promise.all(authorPromises);
        bookData.authors = authors;  // Add author data to the book object
      }

      // Add cover image if available
      if (bookData.covers && bookData.covers.length > 0) {
        bookData.imageUrl = `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`;
      }

      return bookData;
    } else {
      console.error(`Book not found or invalid data for ${key}:`, result);
      return undefined;
    }
  } catch (err) {
    console.error(`Error in fetchBook with key ${key}:`, err);
    return undefined;
  }
};


fastifyServer.listen({ port: Number(PORT) }, (err, address) => {
  if (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
