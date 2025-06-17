import styled from "styled-components";
import ArrowIcon from "../../../../assets/icons/arrow.svg?react";

const GenreDropdown = ({
  genre,
  genreSearch,
  setGenreSearch,
  dropdownOpen,
  setDropdownOpen,
  filteredGenres,
  handleGenreSelect,
  loading,
}) => {
  return (
    <DropdownContainer>
      <DropdownInput
        placeholder="Search for genre"
        value={dropdownOpen ? genreSearch : genre}
        onChange={(e) => {
          setGenreSearch(e.target.value);
          setDropdownOpen(true);
        }}
        onFocus={() => {
          setDropdownOpen(true);
          setGenreSearch(genre);
        }}
        onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
        onClick={() => {
          setDropdownOpen(true);
          setGenreSearch(genre);
        }}
        disabled={loading}
      />
      <ArrowWrapper open={dropdownOpen}>
        <ArrowIcon />
      </ArrowWrapper>
      {dropdownOpen && (
        <DropdownList>
          {filteredGenres.map((g) => (
            <DropdownItem key={g} onMouseDown={() => handleGenreSelect(g)}>
              {g}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownInput = styled.input`
  border-radius: 10px;
  background-color: #d9d9d9;
  color: #3d3131;
  border: none;
  height: 44px;
  width: 100%;
  padding-left: 16px;
  font-size: 1rem;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 46px;
  left: 0;
  width: 100%;
  background: #232323;
  border: 1px solid #aaa;
  border-radius: 8px;
  z-index: 10;
  max-height: 120px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background: #ff4343;
    color: #fff;
  }
`;

const ArrowWrapper = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.2s;
    transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export default GenreDropdown;
