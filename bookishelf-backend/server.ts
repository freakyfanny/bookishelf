import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import dotenv from "dotenv";
import { request } from "undici";
import cors from "@fastify/cors";
import { Author, Book } from "../shared/types"; // Import shared types

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

interface QueryWithSearchParamLimitOffset {
  searchParam: string;
  limit: string;
  offset: string;
}

// Fetch Books
fastifyServer.get("/books", async (req: FastifyRequest<{ Querystring: QueryWithIdType }>, reply: FastifyReply) => {
  try {
    const result: Book | undefined = await getBook(req.query.id as string, req.query.type as string);
    reply.send(result);
  } catch (err) {
    console.error(`Error in /books route: ${err}`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Fetch Book Details
fastifyServer.get("/bookDetails", async (req: FastifyRequest<{ Querystring: QueryWithKey }>, reply: FastifyReply) => {
  try {
    const result: Book | undefined = await getBookDetails(req.query.key as string);
    reply.send(result);
  } catch (err) {
    console.error(`Error in /bookDetails route: ${err}`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Fetch Author Details
fastifyServer.get("/authorDetails", async (req: FastifyRequest<{ Querystring: QueryWithKey }>, reply: FastifyReply) => {
  try {
    const authorId = req.query.key as string;
    const result: Author = await fetch(`${url}/authors/${authorId}.json`).then((res) => res.json());

    reply.send(result);
  } catch (err) {
    console.error(`Error in /authorDetails route: ${err}`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Search Books and Authors
fastifyServer.get("/search", async (req: FastifyRequest<{ Querystring: QueryWithSearchParamLimitOffset & { limit?: string, offset?: string } }>, reply: FastifyReply) => {
  try {
    const result = await search(req.query.searchParam as string, req.query.limit, req.query.offset);
    reply.send(result);
  } catch (err) {
    console.error(`Error in /search route: ${err}`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Search Function
const search = async (query: string, limit?: string, offset?: string) => {
  try {
    const responseBooks = await request(`${url}/search.json?q=${query}`, { method: "GET" });
    const responseAuthors = await request(`${url}/search/authors.json?q=${query}`, { method: "GET" });

    const bookData: any = await responseBooks.body.json();
    const authorData: any = await responseAuthors.body.json();

    const combinedResults = [
      ...bookData.docs.map((book: any) => ({
        title: book.title,
        author: book.author_name || "Unknown Author",
        key: book.key,
        imageUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : undefined, // Add imageUrl for book
        ...book,
      })),
      ...authorData.docs.map((author: any) => ({
        ...author,
      })),
    ];

    // Pagination logic
    const parsedLimit = limit ? parseFloat(limit) : combinedResults.length;
    const parsedOffset = offset ? parseFloat(offset) : 0;
    const end = parsedLimit + parsedOffset;
    const slicedResults = combinedResults.slice(parsedOffset, end);

    return slicedResults;
  } catch (err) {
    console.error(`Error in search: ${err}`);
    throw err;
  }
};



// Fetch Book Data
const getBook = async (id: string, type: string): Promise<Book | undefined> => {
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
    console.error(`Error in getBook: ${err}`);
    throw err;
  }
};


// Fetch Book Details
const getBookDetails = async (key: string): Promise<Book | undefined> => {
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
    console.error(`Error in getBookDetails: ${err}`);
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
