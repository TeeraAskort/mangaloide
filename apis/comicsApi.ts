import axios from "axios";

const comicsApi = axios.create({
  baseURL: `http://${process.env.NEXT_PUBLIC_BASE_URL}/api`,
});

export default comicsApi;
