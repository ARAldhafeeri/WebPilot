import dotenv from "dotenv";

dotenv.config();

export const API_KEY = `${process.env.API_KEY}`;
export const MODEL_PROVIDER = `${process.env.MODEL_PROVIDER}`;
export const MODEL_SLUG = `${process.env.MODEL_SLUG}`;
export const OLLAMA_URL = `${process.env.OLLAMA_URL}`;
