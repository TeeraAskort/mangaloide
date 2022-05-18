import axios from "axios";

const comicsApi = axios.create({
  baseURL: "http://localhost/api",
});

export default comicsApi;
