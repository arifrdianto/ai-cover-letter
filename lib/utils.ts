import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseCoverLetterContent = (rawContent: string): string[] => {
  // Split by double newlines to separate paragraphs
  return rawContent
    .split("\n\n")
    .filter((paragraph) => paragraph.trim() !== "")
    .map((paragraph) => paragraph.trim());
};

export const parseRawText = (rawText: string, name: string) => {
  // Extract letter body
  const letterBodyMatch = rawText.match(
    new RegExp(`Dear Hiring Manager,(.*?)(${name})`, "s")
  );
  const letterBody = letterBodyMatch ? letterBodyMatch[1].trim() : "";

  return parseCoverLetterContent(letterBody);
};
