import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/blocks/Navbar/Navbar";
import ControlBar from "../components/players/ControlBar";
import SearchResults from "../components/blocks/SearchBlocks/SearchResults";

const SEARCH_TABS = [
  { label: "Everything", value: "everything" },
  { label: "Songs", value: "songs" },
  { label: "Artists", value: "artists" },
  { label: "Albums", value: "albums" },
  { label: "EPs", value: "eps" },
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState("everything");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query !== searchTerm) {
      setSearchTerm(query || "");
    }
  }, [searchParams]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <MainWrapper>
      <Navbar />
      <ContentWrapper>
        {searchTerm && (
          <SearchHeader>
            <SearchHeaderContent>
              <SearchQuery>
                Search results for: <span>"{searchTerm}"</span>
              </SearchQuery>

              <FilterTabs>
                {SEARCH_TABS.map((tab) => (
                  <FilterTab
                    key={tab.value}
                    $active={activeFilter === tab.value}
                    onClick={() => handleFilterChange(tab.value)}
                  >
                    {tab.label}
                  </FilterTab>
                ))}
              </FilterTabs>
            </SearchHeaderContent>
          </SearchHeader>
        )}

        <SearchContent>
          <SearchContentInner>
            {searchTerm ? (
              <SearchResults
                searchTerm={searchTerm}
                activeFilter={activeFilter}
              />
            ) : (
              <EmptyState>
                <EmptyIcon>🔍</EmptyIcon>
                <EmptyTitle>Start searching</EmptyTitle>
                <EmptyMessage>
                  Use the search bar in the navigation to find your favorite
                  songs, artists, albums, and EPs
                </EmptyMessage>
              </EmptyState>
            )}
          </SearchContentInner>
        </SearchContent>
      </ContentWrapper>
      <ControlBar />
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #232323;
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 120px;
`;

const SearchHeader = styled.div`
  border-bottom: 1px solid #333;
  background: #191919;
  width: 1190px;
  margin: 0 auto;
  border-radius: 8px;
  padding: 32px 0;
`;

const SearchHeaderContent = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 0 48px;
`;

const SearchQuery = styled.div`
  color: #fff;
  font-size: 18px;
  margin-bottom: 24px;

  span {
    color: #ff4343;
    font-weight: 600;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  background: ${({ $active }) => ($active ? "#ff4343" : "transparent")};
  border: 2px solid ${({ $active }) => ($active ? "#ff4343" : "#444")};
  color: ${({ $active }) => ($active ? "#fff" : "#888")};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff4343;
    color: #fff;
  }
`;

const SearchContent = styled.div`
  padding: 32px 0;
`;

const SearchContentInner = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 0 48px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h2`
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const EmptyMessage = styled.p`
  color: #888;
  font-size: 18px;
  margin: 0;
  max-width: 500px;
  line-height: 1.5;
`;

export default Search;
