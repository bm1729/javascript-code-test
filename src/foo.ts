import axios from "axios";

const fetchPokemon = async () => {
  const response = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");
  console.log(response.data);

  return response.data;
};

export { fetchPokemon };
