import axios from "axios";
import { fetchPokemon } from "./foo";

jest.mock("axios");

describe("foo", () => {
  it("pokemon API should return a pokemon", async () => {
    const mockResponse = { name: "ditto" };
    axios.get = jest.fn().mockResolvedValue({data: mockResponse});

    const result = await fetchPokemon();

    expect(result).toEqual(mockResponse);
  });
});