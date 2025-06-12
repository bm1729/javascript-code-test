import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

const fetchPokemon = () => {
  return axiosInstance.get("/pokemon/ditto").then((response) => {
    console.log("Response received from API:", response);
    return response;
  });
};

export { fetchPokemon };
