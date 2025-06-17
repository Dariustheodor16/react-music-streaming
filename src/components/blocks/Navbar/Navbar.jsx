import styled from "styled-components";
import logo from "../../../assets/logo.png";
import miniLogo from "../../../assets/mini-logo.svg";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../services/auth/AuthContext";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase";
import SearchIcon from "../../../assets/icons/search.svg?react";
import { searchService } from "../../../services/api/searchService";
import LoginModal from "../../ui/Modals/LoginModal";

const Navbar = ({ openLoginModal, openRegisterModal }) => {
  const { currentUser, userLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(firestore, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [currentUser]);

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
          searchService.searchTracks(searchQuery.trim(), 3),
          searchService.searchAlbums(searchQuery.trim(), 3),
          searchService.searchUsers(searchQuery.trim(), 3),
        ]);

        const allSuggestions = [
          ...artists.map((artist) => ({
            id: artist.id,
            type: "artist",
            title: artist.displayName,
            subtitle: `Artist • ${artist.followers || 0} followers`,
            image: artist.photoURL,
          })),
          ...albums.map((album) => ({
            id: album.id,
            type: album.type || "album",
            title: album.name,
            subtitle: `${album.type === "ep" ? "EP" : "Album"} • ${
              album.artist
            }`,
            image: album.imageUrl,
          })),
          ...songs.map((song) => ({
            id: song.id,
            type: "song",
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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
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
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "artist") {
      navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    } else if (suggestion.type === "album") {
      navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    } else if (suggestion.type === "song") {
      navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    }
    setShowDropdown(false);
    setSelectedIndex(-1);
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

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
    }
  };

  const handleLoginClick = () => {
    if (openLoginModal) {
      openLoginModal();
    } else {
      setRegisterMode(false);
      setShowLoginModal(true);
    }
  };

  const handleRegisterClick = () => {
    if (openRegisterModal) {
      openRegisterModal();
    } else {
      setRegisterMode(true);
      setShowLoginModal(true);
    }
  };

  return (
    <Container>
      <NavbarContainer>
        <Link to={"/"} className="logo-link">
          <img src={logo} alt="Logo" className="main-logo" />
          <img src={miniLogo} alt="Mini Logo" className="mini-logo" />
        </Link>
        <AnchorContainer>
          <NavAnchor
            onClick={() => navigate("/home")}
            $active={location.pathname === "/home"}
          >
            Home
          </NavAnchor>
          <LibraryAnchor
            onClick={() => navigate("/library")}
            $active={location.pathname === "/library"}
          >
            Library
          </LibraryAnchor>
          {currentUser && (
            <NavAnchor
              onClick={() => navigate("/dashboard")}
              $active={location.pathname === "/dashboard"}
            >
              Dashboard
            </NavAnchor>
          )}
        </AnchorContainer>

        <SearchContainer ref={searchRef}>
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInputContainer $showDropdown={showDropdown}>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search songs, artists, albums, EPs..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowDropdown(true);
                  }
                }}
              />
              {isSearching && <LoadingSpinner />}
            </SearchInputContainer>
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
                      navigate(
                        `/search?q=${encodeURIComponent(searchQuery.trim())}`
                      );
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
        </SearchContainer>

        <LoginContainer>
          {!userLoggedIn ? (
            <>
              <LoginAnchor onClick={handleLoginClick}>Log In</LoginAnchor>
              <SmallRegisterButton
                onClick={handleRegisterClick}
                className="navbar-primary-btn"
              >
                Register
              </SmallRegisterButton>
              <LoginAnchor onClick={handleLoginClick}>Upload</LoginAnchor>
            </>
          ) : (
            <>
              <LoginAnchor
                className="upload-anchor-loggedin"
                onClick={() => navigate("/upload")}
              >
                Upload
              </LoginAnchor>
              <ProfileButton
                onClick={() => navigate(`/profile/${profile?.username}`)}
              >
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Profile" />
                ) : (
                  profile?.displayName?.[0]?.toUpperCase() ||
                  currentUser?.email?.[0]?.toUpperCase()
                )}
              </ProfileButton>
            </>
          )}
        </LoginContainer>
      </NavbarContainer>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialRegister={registerMode}
          onRegistered={(userId) => {
            setShowLoginModal(false);
            d;
            navigate("/profile-setup", { state: { userId } });
          }}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 1190px;
  margin: 0 auto;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #232323;

  .logo-link {
    display: flex;
    align-items: center;
  }

  .main-logo {
    width: 130px;
    height: 37px;
    object-fit: contain;
    display: block;
  }
  .mini-logo {
    display: none;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 1190px) {
    .main-logo {
      width: 120px;
      height: 34px;
    }
  }
  @media (max-width: 600px) {
    .main-logo {
      display: none;
    }
    .mini-logo {
      display: block;
      width: 36px;
      height: 36px;
    }
  }
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1190px;
  max-width: 1190px;
  min-width: 0;
`;

const AnchorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: center;
  margin-left: 26px;
  margin-right: 26px;

  a {
    font-size: 24px;
    text-decoration: none;
    cursor: pointer;
    font-weight: 300;
    &:hover {
      color: #ff4343;
    }
  }
`;

const NavAnchor = styled.a`
  font-size: 24px;
  text-decoration: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#ff4343" : "#fff")};
  font-weight: ${({ $active }) => ($active ? "500" : "300")};
  position: relative;

  &:hover {
    color: #ff4343;
  }
`;

const LibraryAnchor = styled.a`
  font-size: 24px;
  text-decoration: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#ff4343" : "#fff")};
  font-weight: ${({ $active }) => ($active ? "500" : "300")};
  position: relative;

  &:hover {
    color: #ff4343;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 11px;
  align-items: center;
  margin-left: 15px;
`;

const LoginAnchor = styled.a`
  cursor: pointer;
  font-size: 15px;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  margin-right: 12px;

  &.upload-anchor-loggedin {
    margin-right: 42px;
  }
`;

const ProfileButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  transition: transform 0.2s ease;
  border: none;
  outline: none;
  overflow: hidden;
  padding: 0;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
`;

const SmallRegisterButton = styled(PrimaryButton)`
  font-size: 14px;
  padding: 8px 16px;
  height: auto;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 32px;
`;

const SearchForm = styled.form`
  width: 100%;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #2a2a2a;
  border: 2px solid
    ${({ $showDropdown }) => ($showDropdown ? "#ff4343" : "transparent")};
  border-radius: ${({ $showDropdown }) =>
    $showDropdown ? "16px 16px 0 0" : "16px"};
  padding: 0 20px;
  transition: all 0.2s ease;
  height: 34px;

  &:focus-within {
    border-color: #ff4343;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: #888;
    margin-right: 16px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  padding: 0;
  outline: none;

  &::placeholder {
    color: #888;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #333;
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
  background: #2a2a2a;
  border: 2px solid #ff4343;
  border-top: none;
  border-radius: 0 0 16px 16px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1001;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? "#3a3a3a" : "transparent")};
  transition: background-color 0.2s ease;

  &:hover {
    background: #3a3a3a;
  }
`;

const SuggestionImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #444;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const SuggestionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SuggestionTitle = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
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
  padding: 12px 20px;
  border-top: 1px solid #444;
  color: #ff4343;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: #3a3a3a;
  }
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: #888;
  font-size: 14px;
`;

export default Navbar;
