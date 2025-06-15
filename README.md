# Javascript Code Test

`BookSearchApiClient` is a simple class that makes a call to a http API to retrieve a list of books and return them.

You need to refactor the `BookSearchApiClient` class, and demonstrate in `example-client.js` how it would be used. Refactor to what you consider to be production ready code. You can change it in anyway you would like and can use javascript or typescript.

Things you will be asked about:

1. How could you easily add other book seller APIs in the the future?

Create an interface for the BookSearchApiClient class to inherit from:

```typescript
interface BookSearchApi {
  fetchByAuthor(params: BookSearchQueryParams): Promise<Book[]>;
}

class BookSearchApiClient implements BookSearchApi {
  // ...existing implementation...
}

class OtherBookSellerApiClient implements BookSearchApi {
  // ...implementation for another API...
}
```

I could then create a factory to create the desired client:

```typescript
function getBookSellerClient(seller: 'main' | 'other'): BookSearchApi {
  if (seller === 'main') return new BookSearchApiClient(/* ... */);
  if (seller === 'other') return new OtherBookSellerApiClient(/* ... */);
  throw new Error('Unknown seller');
}
```

2. How would you manage differences in response payloads between different APIs without needing to make future changes to whatever code you have in example-client.js

Ensure that the input to the fetchBooks function returns a standard `Book` type regardless of the Api implementation.

3. How would you implement different query types for example: by publisher, by year published etc

Extending the BookSearchQueryParams type to include publisher, year published etc.

4. How your code would be tested

Code should be tested as follows:
* Integration testing - if possible against a real implementation of the server in question. Integrating early in this way shifts integration issues left and ensures that client is compliant against current server implementation (i.e. if server changes, then client should change accordingly). It is also more robust to test in this way as you are testing against what the server actually does and not your understanding which may not be completely correct.
* Contract tests - using Pact we can test the integration points of our system separately. We can produce a contract between ourselves and the BookApi and test against that.
* Property based testing - Libraries such as fast-check can generate a wide range of sample input to ensure our code is robust.
* Wider range of error handling tests - Explicitly test for network failures, timeouts, invalid data, unexpected status codes.
* Mutation testing - These ensure the quality of unit tests by mutating source code and checking that the introduced bugs are caught.

