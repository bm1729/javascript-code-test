import mockAxios from "jest-mock-axios";
import { BookSearchApiClient } from "./foo";

describe("foo", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("pokemon API should return a pokemon", () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();

    const config = {
      baseURL: "https://pokeapi.co/api/v2",
      timeout: 1000,
    };
    const bookSearchApiClient = new BookSearchApiClient(config);

    bookSearchApiClient.fetchPokemon().then(thenFn).catch(catchFn);

    expect(mockAxios.get).toHaveBeenCalledWith("/pokemon/ditto");

    const mockResponse = { data: { name: "ditto" }, status: 200 };
    mockAxios.mockResponse(mockResponse);

    expect(thenFn).toHaveBeenCalled();
    expect(catchFn).not.toHaveBeenCalled();
  });

  // TODO Tests for error handling

  // TODO Tests for invalid requests

  // TODO Tests for invalid responses

  // TODO Tets for xml response
});
