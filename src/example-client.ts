import { BookSearchApiClient } from './BookSearchApiClient.js';

const config = {
  baseURL: 'https://api.example.com/books',
  timeout: 5000,
};

const client = new BookSearchApiClient(config);
const booksByShakespeare = client.getBooksByAuthor({ authorName: 'Shakespeare', limit: 10 });
