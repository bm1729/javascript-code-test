import mockAxios from 'jest-mock-axios';
import { BookSearchApiClient } from './foo';

const apiJsonResponse = [
  {
    book: { title: 'The Shining', author: 'Stephen King', isbn: '978-0307743657' },
    stock: { quantity: 5, price: 19.99 },
  },
  {
    book: { title: 'It', author: 'Stephen King', isbn: '978-0450411434' },
    stock: { quantity: 3, price: 15.99 },
  },
  {
    book: { title: 'Misery', author: 'Stephen King', isbn: '978-0450411434' },
    stock: { quantity: 2, price: 12.99 },
  },
];

const expectedClientResponse = [
  { author: 'Stephen King', isbn: '978-0307743657', price: 19.99, quantity: 5, title: 'The Shining' },
  { author: 'Stephen King', isbn: '978-0450411434', price: 15.99, quantity: 3, title: 'It' },
  { author: 'Stephen King', isbn: '978-0450411434', price: 12.99, quantity: 2, title: 'Misery' },
];

const config = {
  baseURL: 'http://api.book-seller-example.com',
  timeout: 1000,
};

type FetchByAuthorParams = Parameters<BookSearchApiClient['fetchByAuthor']>[0];

describe('BookSearchApiClient', () => {
  let client: BookSearchApiClient;
  let thenFn: jest.Mock, catchFn: jest.Mock;

  beforeEach(() => {
    client = new BookSearchApiClient(config);
    thenFn = jest.fn();
    catchFn = jest.fn();
    mockAxios.reset();
  });

  const cases = [
    {
      name: 'all params as expected',
      input: { authorName: 'Stephen King', format: 'json', limit: 20 } as FetchByAuthorParams,
      expectedParams: { q: 'Stephen King', format: 'json', limit: 20 },
    },
    {
      name: 'default format and limit',
      input: { authorName: 'Stephen King' } as FetchByAuthorParams,
      expectedParams: { q: 'Stephen King', format: 'json', limit: 10 },
    },
  ];

  it.each(cases)('fetchByAuthor: $name', ({ input, expectedParams }) => {
    client.fetchByAuthor(input).then(thenFn).catch(catchFn);

    expect(mockAxios.get).toHaveBeenCalledWith('/by-author', { params: expectedParams });

    mockAxios.mockResponse({ data: apiJsonResponse, status: 200 });

    expect(thenFn).toHaveBeenCalledWith(expectedClientResponse);
    expect(catchFn).not.toHaveBeenCalled();
  });

  it('should handle errors from the API', () => {
    client.fetchByAuthor({ authorName: 'Stephen King' }).then(thenFn).catch(catchFn);

    expect(mockAxios.get).toHaveBeenCalledWith('/by-author', {
      params: { q: 'Stephen King', format: 'json', limit: 10 },
    });

    const mockError = { message: 'Network Error', status: 500 };
    mockAxios.mockError(mockError);

    expect(catchFn).toHaveBeenCalledWith(mockError);
    expect(thenFn).not.toHaveBeenCalled();
  });
});
