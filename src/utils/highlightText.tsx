import React from "react";

/**
 * Highlight bagian teks yang cocok dengan query pencarian.
 * @param text - Teks asli
 * @param query - Kata kunci pencarian
 * @returns JSX Element dengan teks yang disorot
 */
export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}
