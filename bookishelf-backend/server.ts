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

// Fetch Books
fastifyServer.get(
  "/books",
  async (req: FastifyRequest<{ Querystring: QueryWithIdType }>, reply: FastifyReply) => {
    try {
      const { id, type } = req.query;

      if (!id || !type) {
        return reply.status(400).send({ error: "Query parameters 'id' and 'type' are required." });
      }

      const result: Book | undefined = await fetchBook(id, type);

      if (!result) {
        return reply.status(404).send({ error: "Book not found." });
      }

      return reply.send(result);
    } catch (err) {
      console.error(`Error in /books route: ${err}`);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
);


// Fetch Book Details
fastifyServer.get(
  "/bookDetails",
  async (req: FastifyRequest<{ Querystring: QueryWithKey }>, reply: FastifyReply) => {
    try {
      const { key } = req.query;

      if (!key) {
        return reply.status(400).send({ error: "Query parameter 'key' is required." });
      }

      const result: Book | undefined = await fetchBookDetails(key);

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
  "/authorDetails",
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

// Search Book or Author
fastifyServer.get(
  "/search",
  async (
    req: FastifyRequest<{ Querystring: QueryWithSearchParamLimitOffsetFilter & { limit?: string; offset?: string; filter?: string } }>,
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

      const result = await fetchSearchResults(searchParam, limit, offset, filter);
      if (!result || result.length === 0) {
        return reply.status(404).send({ error: `No results found for the given search query and filter: '${filter}'` });
      }

      reply.send(result);
    } catch (err) {
      console.error(`Error in /search route: ${err}`);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Search Function
const fetchSearchResults = async (query: string, limit?: string, offset?: string, filter?: string) => {
  try {
    let results: any[] = [];
    console.log("------------------ filter -----------------");
    console.log(filter);

    if (filter == "books" || !filter) {
      const responseBooks = await request(`${url}/search.json?q=${query}`, { method: "GET" });
      const bookData: any = await responseBooks.body.json();
      results = bookData.docs.map((book: any) => ({
        title: book.title,
        author: book.author_name || "Unknown Author",
        key: book.key,
        imageUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : undefined,
        ...book,
      }));
    } else if(filter == "authors") {
      const responseAuthors = await request(`${url}/search/authors.json?q=${query}`, { method: "GET" });
      const authorData: any = await responseAuthors.body.json();
      results = authorData.docs.map((author: any) => ({
        name: author.name,
        key: author.key,
        birth_date: author.birth_date || "Unknown",
        ...author,
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



// Fetch Book Data
const fetchBook = async (id: string, type: string): Promise<Book | undefined> => {
  try {
    const response = await request(`${url}/api/books?bibkeys=${type}%3A${id}&format=json&jscmd=viewapi`, {
      method: "GET",
    });

    const result: any = await response.body.json();

    if (result && result[`${type}:${id}`]) {
      const bookData = result[`${type}:${id}`];

      if (bookData.cover_id) {
        bookData.imageUrl = `https://covers.openlibrary.org/b/id/${bookData.cover_id}-L.jpg`;
      }

      return bookData;
    } else {
      console.error("Book not found or invalid data:", result);
      return undefined;
    }
  } catch (err) {
    console.error(`Error in fetchBook: ${err}`);
    throw err;
  }
};

// Fetch Book Details
const fetchBookDetails = async (key: string): Promise<Book | undefined> => {
  try {
    const response = await request(`${url}${key}`, { method: "GET" });
    const result: any = await response.body.json();

    // Validate the response data
    if (result && result.title && result.authors) {
      return result;
    } else {
      console.error("Invalid book details response:", result);
      return undefined;
    }
  } catch (err) {
    console.error(`Error in fetchBookDetails: ${err}`);
    throw err;
  }
};

fastifyServer.listen({ port: Number(PORT) }, (err, address) => {
  if (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
