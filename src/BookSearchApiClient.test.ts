import nock from 'nock';
import { BookSearchApiClient } from './BookSearchApiClient';
import { describe, test, expect } from 'vitest';
import { before } from 'node:test';

const baseURL = 'https://www.example.com';

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

const apiXmlResponse = `
<books>
  <book>
    <title>The Shining</title>
    <author>Stephen King</author>
    <isbn>978-0307743657</isbn>
    <stock>
      <quantity>5</quantity>
      <price>19.99</price>
    </stock>
  </book>
  <book>
    <title>It</title>
    <author>Stephen King</author>
    <isbn>978-0450411434</isbn>
    <stock>
      <quantity>3</quantity>
      <price>15.99</price>
    </stock>
  </book>
  <book>
    <title>Misery</title>
    <author>Stephen King</author>
    <isbn>978-0450411434</isbn>
    <stock>
      <quantity>2</quantity>
      <price>12.99</price>
    </stock>
  </book>
</books>
`;

const expectedClientResponse = [
  { author: 'Stephen King', isbn: '978-0307743657', price: 19.99, quantity: 5, title: 'The Shining' },
  { author: 'Stephen King', isbn: '978-0450411434', price: 15.99, quantity: 3, title: 'It' },
  { author: 'Stephen King', isbn: '978-0450411434', price: 12.99, quantity: 2, title: 'Misery' },
];

describe('BookSearchApiClient', () => {
  let client: BookSearchApiClient;
  before(() => {
    client = new BookSearchApiClient({
      baseURL,
      timeout: 1000,
    });
    nock.cleanAll();
  });

  test('can get books using json format', async () => {
    // arrange
    const scope = nock(baseURL)
      .get('/by-author')
      .query({ q: 'Stephen King', limit: 10, format: 'json' })
      .reply(200, apiJsonResponse);

    // act
    const response = await client.getBooksByAuthor({ authorName: 'Stephen King', limit: 10, format: 'json' });

    // assert
    expect(response).toEqual(expectedClientResponse);
    scope.done();
  });

  test('can get books using xml format', async () => {
    // arrange
    const scope = nock(baseURL)
      .get('/by-author')
      .query({ q: 'Stephen King', limit: 10, format: 'xml' })
      .reply(200, apiXmlResponse);

    // act
    const response = await client.getBooksByAuthor({ authorName: 'Stephen King', limit: 10, format: 'xml' });

    // assert
    expect(response).toEqual(expectedClientResponse);
    scope.done();
  });

  test('can handle errors', async () => {
    // arrange
    const scope = nock(baseURL)
      .get('/by-author')
      .query({ q: 'Stephen King', limit: 10, format: 'json' })
      .replyWithError('Network Error');

    // act and assert
    await expect(client.getBooksByAuthor({ authorName: 'Stephen King', limit: 10, format: 'json' })).rejects.toThrow(
      'Network Error',
    );
    scope.done();
  });
});
