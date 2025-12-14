import axios from "axios";

export const api = axios.create({
  baseURL: "https://cargoopt-d0bee956a2ea.herokuapp.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
