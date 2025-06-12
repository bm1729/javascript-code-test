import mockAxios from "jest-mock-axios";
import { fetchPokemon } from "./foo";

describe("foo", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("pokemon API should return a pokemon", () => {
    let catchFn = jest.fn(),
      thenFn = jest.fn();

    fetchPokemon().then(thenFn).catch(catchFn);

    expect(mockAxios.get).toHaveBeenCalledWith("/pokemon/ditto");

    const mockResponse = { data: { name: "ditto" }, status: 200 };
    mockAxios.mockResponse(mockResponse);

    expect(thenFn).toHaveBeenCalled();
    expect(catchFn).not.toHaveBeenCalled();
  });
});
