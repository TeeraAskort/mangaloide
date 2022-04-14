import axios from "axios";

const comicsApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default comicsApi;
