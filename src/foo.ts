import axios, { AxiosInstance } from 'axios';

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
  axiosInstance: AxiosInstance;

  constructor(config: BookSearchApiClientConfig) {
    this.axiosInstance = axios.create({
      ...bookSearchApiConfigDefaults,
      ...config,
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

      return this.axiosInstance
        .get('/by-author', {
          params: { q: authorName, limit, format },
        })
        .then((response) => {
          return response.data as BookSearchApiItem[];
        })
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
