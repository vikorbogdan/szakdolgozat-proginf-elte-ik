import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import parse from "html-react-parser";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}m`;
};

const htmlDecode = (text: string) => {
  var el = document.createElement("div");
  el.innerHTML = text;
  return el.innerText || el.textContent || "Text could not be decoded";
};

export const parseText = (text: string) => {
  return parse(htmlDecode(text));
};
