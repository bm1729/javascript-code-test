import mockAxios from "jest-mock-axios";
import { BookSearchApiClient } from "./foo";

const apiJsonResponse = [
  {
    book: {
      title: "The Shining",
      author: "Stephen King",
      isbn: "978-0307743657",
    },
    stock: {
      quantity: 5,
      price: 19.99,
    },
  },
  {
    book: {
      title: "It",
      author: "Stephen King",
      isbn: "978-0450411434",
    },
    stock: {
      quantity: 3,
      price: 15.99,
    },
  },
  {
    book: {
      title: "Misery",
      author: "Stephen King",
      isbn: "978-0450411434",
    },
    stock: {
      quantity: 2,
      price: 12.99,
    },
  },
];

const expectedClientResponse = [
  {
    author: "Stephen King",
    isbn: "978-0307743657",
    price: 19.99,
    quantity: 5,
    title: "The Shining",
  },
  {
    author: "Stephen King",
    isbn: "978-0450411434",
    price: 15.99,
    quantity: 3,
    title: "It",
  },
  {
    author: "Stephen King",
    isbn: "978-0450411434",
    price: 12.99,
    quantity: 2,
    title: "Misery",
  },
];

const config = {
  baseURL: "http://api.book-seller-example.com",
  timeout: 1000,
};

describe("BookSearcchApiClient", () => {
  let target: BookSearchApiClient;
  let thenFn: jest.Mock, catchFn: jest.Mock;

  beforeEach(() => {
    target = new BookSearchApiClient(config);
    thenFn = jest.fn();
    catchFn = jest.fn();
    mockAxios.reset();
  });

  describe("fetchByAuthor", () => {
    it("should fetch books by author passing through all params as expected", () => {
      target
        .fetchByAuthor({
          authorName: "Stephen King",
          format: "json",
          limit: 20,
        })
        .then(thenFn)
        .catch(catchFn);

      expect(mockAxios.get).toHaveBeenCalledWith("/by-author", {
        params: { q: "Stephen King", format: "json", limit: 20 },
      });

      const mockResponse = { data: apiJsonResponse, status: 200 };
      mockAxios.mockResponse(mockResponse);

      expect(thenFn).toHaveBeenCalledWith(expectedClientResponse);
      expect(catchFn).not.toHaveBeenCalled();
    });

    it("should fetch books by author using default format and limit", () => {
      target
        .fetchByAuthor({
          authorName: "Stephen King",
        })
        .then(thenFn)
        .catch(catchFn);

      expect(mockAxios.get).toHaveBeenCalledWith("/by-author", {
        params: { q: "Stephen King", format: "json", limit: 10 },
      });

      const mockResponse = { data: apiJsonResponse, status: 200 };
      mockAxios.mockResponse(mockResponse);

      expect(thenFn).toHaveBeenCalledWith(expectedClientResponse);
      expect(catchFn).not.toHaveBeenCalled();
    });
  });

  // TODO Tests for error handling

  // TODO Tests for invalid requests

  // TODO Tests for invalid responses

  // TODO Tets for xml response
});
