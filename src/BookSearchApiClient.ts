import { randomUUID } from 'crypto';
import got, { Got, Options } from 'got';
import { XMLParser } from 'fast-xml-parser';

const DEFAULT_REQUEST_TIMEOUT_MS = 1000;
const DEFAULT_LIMIT = 10;
const DEFAULT_FORMAT = 'json';

type BookSearchApiClientConfig = {
  baseURL: string;
  timeout?: number;
};

type BookSearchByAuthorQueryParams = {
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
/**
 * Client for interacting with the book search API.
 */
class BookSearchApiClient {
  private client: Got;
  private parser: XMLParser;

  constructor(config: BookSearchApiClientConfig) {
    this.parser = new XMLParser();
    this.client = got.extend({
      prefixUrl: config.baseURL,
      timeout: {
        request: config.timeout || DEFAULT_REQUEST_TIMEOUT_MS,
      },
      hooks: {
        beforeRequest: [
          (options: Options) => {
            const correlationId = randomUUID();
            options.headers['x-correlation-id'] = correlationId;
            const requestUrl = (options.url = typeof options.url === 'string' ? options.url : options.url?.href);
            console.log('Requesting:', requestUrl, 'Correlation ID:', correlationId);
          },
        ],
        afterResponse: [
          (response) => {
            const correlationId = response.request.options.headers['x-correlation-id'] || '';
            console.log('Response:', response.statusCode, 'Correlation ID:', correlationId);
            return response;
          },
        ],
      },
    });
  }

  private parseBooksXml(xml: string): Book[] {
    const parsed = this.parser.parse(xml);
    const booksRaw: Array<{
      title: string;
      author: string;
      isbn: string;
      stock: { quantity: string | number; price: string | number };
    }> = Array.isArray(parsed.books.book) ? parsed.books.book : [parsed.books.book];
    return booksRaw.map((b) => ({
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      quantity: Number(b.stock.quantity),
      price: Number(b.stock.price),
    }));
  }

  private parseBooksJson(response: BookSearchApiItem[]): Book[] {
    return response.map((item) => ({
      title: item.book.title,
      author: item.book.author,
      isbn: item.book.isbn,
      quantity: item.stock.quantity,
      price: item.stock.price,
    }));
  }

  /**
   * Get books by author from the API.
   * @param params - Query parameters for the search. Additional parameters can be added to further refine the search, including the format in which they should be retreived from the upstream API.
   * @returns Promise resolving to an array of Book objects.
   */
  getBooksByAuthor({ authorName, limit, format }: BookSearchByAuthorQueryParams): Promise<Book[]> {
    {
      format = format || DEFAULT_FORMAT;
      limit = limit || DEFAULT_LIMIT;

      if (format === 'xml') {
        return this.client
          .get('by-author', {
            searchParams: { q: authorName, limit, format },
          })
          .text()
          .then((xml) => this.parseBooksXml(xml));
      } else {
        return this.client
          .get('by-author', {
            searchParams: { q: authorName, limit, format },
          })
          .json<BookSearchApiItem[]>()
          .then((json) => this.parseBooksJson(json));
      }
    }
  }
}

export { BookSearchApiClient, Book };
