import { Link } from "../types/memory";

export const linkCreator = (link: string, depth: number): Link => {
  return {
    url: link,
    depth: depth,
  };
};
