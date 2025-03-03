require('dotenv').config();
const { request } = require('undici');
const fastifyServer = require('fastify')({
  logger: process.env.NODE_ENV === 'development' ? { level: 'debug' } : { level: 'info' }
});

fastifyServer.register(require('fastify-cors'), {
  origin: '*',
});

const url = "https://openlibrary.org";
const PORT = process.env.PORT || 3000; // Default to 3000 if no PORT is set

// Route for fetching books
fastifyServer.get("/books", async (request, reply) => {
  try {
    const result = await getBook(request.query.id, request.query.type);
    console.log("books result", result);
    reply.send(result);
  } catch (err) {
    console.error(`Error in /books route: ${err}`);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route for fetching book details
fastifyServer.get("/bookDetails", async (request, reply) => {
  try {
    const result = await getBookDetails(request.query.key);
    reply.send(result);
  } catch (err) {
    console.error(`Error in /bookDetails route: ${err}`);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// Search route
fastifyServer.get("/search", async (request, reply) => {
  try {
    const result = await search(request.query.searchParam);

    const end = parseFloat(request.query.limit) + parseFloat(request.query.offset);
    let sliced = Object.values(result.docs).slice(request.query.offset, end);

    const updatedBooks = await mapToBookStructure(sliced);
    result.docs = updatedBooks;

    reply.send(result);
  } catch (err) {
    console.error(`Error in /search route: ${err}`);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

// Map the book structure
const mapToBookStructure = async (books) => {
  const mapResult = await Promise.all(
    books.map(async (book) => {
      let updatedBook, bookDetails;

      if (book.isbn?.length > 0) {
        updatedBook = await getBook(book.isbn[0], "isbn");
        bookDetails = await getBookDetails(book.key);
      } else if (book.oclc?.length > 0) {
        updatedBook = await getBook(book.oclc[0], "oclc");
        bookDetails = await getBookDetails(book.key);
      }

      return {
        ...updatedBook,
        ...bookDetails,
        publishDate: book.first_publish_year || "",
        rating: book.ratings_average || 0,
        ratingCount: book.ratings_count || 0,
        wantRead: book.want_to_read_count || 0,
        currentlyReading: book.currently_reading_count || 0,
        alreadyRead: book.already_read_count || 0,
        pages: book.number_of_pages_median || "Unknown",
        key: book.key || "",
        title: book.title || "",
        oclc: book.oclc || "",
        isbn: book.isbn || "",
        author: book.author_name || "",
        authorKey: book.author_key || "",
        category: book.subject_facet ? book.subject_facet.slice(0, 5) : [],
      };
    })
  );

  return mapResult;
};

// Search function
const search = async (query) => {
  try {
    const response = await request(`${url}/search.json?q=${query}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    const data = await response.body.json();
    console.log("Search result:", data);
    return data;
  } catch (err) {
    console.error(`Error in search: ${err}`);
    throw err;
  }
};

// Get book data function
const getBook = async (id, type) => {
  try {
    const response = await request(`${url}/api/books?bibkeys=${type}%3A${id}&format=json&jscmd=viewapi`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    const result = await response.body.json();
    return result[`${type}:${id}`];
  } catch (err) {
    console.error(`Error in getBook: ${err}`);
    throw err;
  }
};

// Get book details function
const getBookDetails = async (key) => {
  try {
    const response = await request(`${url}/${key}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    const result = await response.body.json();
    return result;
  } catch (err) {
    console.error(`Error in getBookDetails: ${err}`);
    throw err;
  }
};

fastifyServer.listen({ port: PORT }, (err, address) => {
  if (err) {
    throw fastifyServer.log.error(err);
  }
  console.log(`Server is now listening on ${address}`);
})