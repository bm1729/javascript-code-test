import { randomUUID } from 'crypto';
import got, { Got } from 'got';

const bookSearchApiConfigDefaults = {
  timeout: 1000,
};

type BookSearchApiClientConfig = {
  baseURL: string;
  timeout?: number;
};

type BookSearchQueryParams = {
  authorName: string;
  limit?: number;
  format?: 'json' | 'xml';
};

type BookSearchApiItem = {
  book: {
    title: string;
    author: string;
    isbn: string;
  };
  stock: {
    quantity: number;
    price: number;
  };
};

type Book = {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  price: number;
};

// TODO Need to write client code showing how to use the BookSearchApiClient
// TODO Convert to use Got instead of Axios
// TODO Need to update the readme

class BookSearchApiClient {
  client: Got;

  constructor(config: BookSearchApiClientConfig) {
    this.client = got.extend({
      prefixUrl: config.baseURL,
      hooks: {
        beforeRequest: [
          (options) => {
            // Generate a correlation ID for each request
            const correlationId = randomUUID();
            options.headers['x-correlation-id'] = correlationId;
            // Attach to options for later use
            (options as any)._correlationId = correlationId;
            console.log(
              'Requesting:',
              typeof options.url === 'string' ? options.url : options.url?.href,
              'Correlation ID:',
              correlationId,
            );
          },
        ],
        afterResponse: [
          (response) => {
            // Retrieve the correlation ID from the request options
            const correlationId = (response.request.options as any)._correlationId;
            console.log('Response:', response.statusCode, 'Correlation ID:', correlationId);
            return response;
          },
        ],
      },
    });
  }

  // TODO Needs to parse json and xml
  // TODO Interceptors for logging and error handling
  fetchByAuthor(params: BookSearchQueryParams): Promise<Book[]> {
    {
      // Apply default values for parameters
      const { authorName, limit, format } = {
        ...{ limit: 10, format: 'json' },
        ...params,
      };

      return this.client
        .get('by-author', { searchParams: { q: authorName, limit, format } })
        .json<BookSearchApiItem[]>()
        .then((response) =>
          response.map((item) => ({
            title: item.book.title,
            author: item.book.author,
            isbn: item.book.isbn,
            quantity: item.stock.quantity,
            price: item.stock.price,
          })),
        );
    }
  }
}

export { BookSearchApiClient, Book };
