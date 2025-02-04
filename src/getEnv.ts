import dotenv from "dotenv";

dotenv.config();

export const API_KEY = `${process.env.API_KEY}`;
export const MODEL_PROVIDER = `${process.env.MODEL_PROVIDER}`;
export const MODEL_SLUG = `${process.env.MODEL_SLUG}`;
export const OLLAMA_URL = `${process.env.OLLAMA_URL}`;
export const PROVIDER_BASE_URL = `${process.env.PROVIDER_BASE_URL}`;

// search
export const SEARCH_RESULTS = parseInt(`${process.env.SEARCH_RESULTS}`);
export const SEARCH_DEPTH = parseInt(`${process.env.SEARCH_RESULTS}`);

// crawl
export const CRAWL_BASE = parseInt(`${process.env.SEARCH_RESULTS}`);
export const CRAWL_DEPTH = parseInt(`${process.env.SEARCH_RESULTS}`);
