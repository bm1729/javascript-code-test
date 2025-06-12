import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

const bookSearchApiConfigDefaults = {
  timeout: 1000,
};

type BookSearchApiClientConfig = {
  baseURL: string;
  timeout?: number;
};

// TODO Need to write client code showing how to use the BookSearchApiClient

// TODO Need to update the readme

class BookSearchApiClient {
  axiosInstance: Axios.AxiosInstance;

  constructor(config: BookSearchApiClientConfig) {
    this.axiosInstance = axios.create({
      ...bookSearchApiConfigDefaults,
      ...config,
    });
  }

  // TODO Needs to parse json and xml
  // TODO Interceptors for logging and error handling
  fetchPokemon() {
    return axiosInstance.get("/pokemon/ditto").then((response) => {
      console.log("Response received from API:", response);
      return response;
    });
  }
}

export { BookSearchApiClientConfig, BookSearchApiClient };
