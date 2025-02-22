const Fastify = require('fastify');
const axios = require('axios'); // to do byt ut till import { request } from 'undici';

const fastify = Fastify({
  logger: true,
});

fastify.register(require('fastify-cors'), {
  origin: '*',
});

fastify.get('api/search', async (request, reply) => {
  const query = request.query.q;

  if (!query) {
    returnreply.status(400).send({
      error: 'Please input a search value',
    });
  }

  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
    const books = response.data.docs;
    if (books.length > 0) {
      const results = books.map(book => ({
        title: book.title,
        author: book.author_name ? book.author_name.join(', ') : 'Unknown author',
        publishYear: book.first_publish_year || 'Unknown year',
        link: `https://openlibrary.org${book.key}`,
      }));
      return results;
    } else {
      return reply.status(404).send({ message: 'No book found.' });
    }
  } catch (error) {
    return reply.status(500).send({
      error: 'An error occured during fetching of books.',
    });
  }
})

const start = async () => {
  try {
    await fastify.listen(3001);
    console.log(`Backend is running on http://localhost:3001`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();