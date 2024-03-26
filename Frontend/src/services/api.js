// Importações de Bibliotecas e Frameworks
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:3030",
  headers: {
    "Content-Type": "application/json",
  },
});
