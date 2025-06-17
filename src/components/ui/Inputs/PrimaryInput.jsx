import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from "../../../assets/icons/search.svg?react";
import { searchService } from "../../../services/api";

const PrimaryInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const [songs, albums, artists] = await Promise.all([
          searchService.searchTracks(searchQuery, 3),
          searchService.searchAlbums(searchQuery, 3),
          searchService.searchUsers(searchQuery, 3),
        ]);

        const allSuggestions = [
          ...artists.map((artist) => ({
            type: "artist",
            id: artist.id,
            title: artist.displayName || artist.username,
            subtitle: `${artist.songsCount || 0} songs`,
            image: artist.photoURL,
          })),
          ...albums.map((album) => ({
            type: "album",
            id: album.id,
            title: album.name,
            subtitle: `Album • ${album.artist}`,
            image: album.imageUrl,
          })),
          ...songs.map((song) => ({
            type: "song",
            id: song.id,
            title: song.title,
            subtitle: `Song • ${
              song.artists ? song.artists.join(", ") : "Unknown Artist"
            }`,
            image: song.imageUrl,
          })),
        ];

        setSuggestions(allSuggestions.slice(0, 8));
        setShowDropdown(allSuggestions.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/?q=${encodeURIComponent(suggestion.title)}`);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearchSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearchSubmit(e);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <SearchForm onSubmit={handleSearchSubmit}>
        <StyledInput
          ref={inputRef}
          type="text"
          placeholder="Search for songs, artists, albums"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        <IconWrapper onClick={handleSearchSubmit}>
          {isSearching ? <LoadingSpinner /> : <SearchIcon />}
        </IconWrapper>
      </SearchForm>

      {showDropdown && (
        <DropdownContainer ref={dropdownRef}>
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <DropdownItem
                  key={`${suggestion.type}-${suggestion.id}`}
                  $selected={index === selectedIndex}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <SuggestionImage>
                    {suggestion.image ? (
                      <img src={suggestion.image} alt={suggestion.title} />
                    ) : (
                      <PlaceholderIcon $type={suggestion.type}>
                        {suggestion.type === "artist"
                          ? "👤"
                          : suggestion.type === "album"
                          ? "💿"
                          : "🎵"}
                      </PlaceholderIcon>
                    )}
                  </SuggestionImage>
                  <SuggestionContent>
                    <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                    <SuggestionSubtitle>
                      {suggestion.subtitle}
                    </SuggestionSubtitle>
                  </SuggestionContent>
                </DropdownItem>
              ))}
              <DropdownFooter
                onClick={() => {
                  navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                  setShowDropdown(false);
                }}
              >
                See all results for "{searchQuery}"
              </DropdownFooter>
            </>
          ) : (
            <NoResults>No results found</NoResults>
          )}
        </DropdownContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 490px;
`;

const SearchForm = styled.form`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  border-radius: 16px;
  background-color: #d9d9d9;
  color: #3d3131;
  border: none;
  padding-left: 20px;
  padding-right: 60px;
  height: 54px;
  width: 100%;
  text-align: left;
  cursor: text;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
  box-sizing: border-box;

  &::placeholder {
    font-size: 16px;
    text-align: left;
    color: #666;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 67, 67, 0.3);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  svg {
    width: 20px;
    height: 20px;
    fill: #666;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top: 2px solid #ff4343;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #333;
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 3px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${({ $selected }) =>
    $selected ? "rgba(255, 67, 67, 0.1)" : "transparent"};

  &:hover {
    background: rgba(255, 67, 67, 0.1);
  }

  &:first-child {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
`;

const SuggestionImage = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 18px;
  color: #666;
`;

const SuggestionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SuggestionTitle = styled.div`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

const SuggestionSubtitle = styled.div`
  color: #888;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownFooter = styled.div`
  padding: 12px 16px;
  background: rgba(255, 67, 67, 0.05);
  color: #ff4343;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-top: 1px solid #333;
  text-align: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;

  &:hover {
    background: rgba(255, 67, 67, 0.1);
  }
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #888;
  font-size: 14px;
`;

export default PrimaryInput;
