import { useState } from "react";

const GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Jazz",
  "Electronic",
  "Classical",
  "Country",
  "R&B",
  "Reggae",
  "Other",
];

export const useGenreDropdown = (genre, setGenre) => {
  const [genreSearch, setGenreSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredGenres = genreSearch
    ? GENRES.filter((g) => g.toLowerCase().includes(genreSearch.toLowerCase()))
    : GENRES;

  const handleGenreSelect = (selectedGenre) => {
    setGenre(selectedGenre);
    setGenreSearch("");
    setDropdownOpen(false);
  };

  return {
    genreSearch,
    setGenreSearch,
    dropdownOpen,
    setDropdownOpen,
    filteredGenres,
    handleGenreSelect,
  };
};
