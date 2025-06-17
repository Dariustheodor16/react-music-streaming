import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../services/auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";
import HeroBlock from "../components/blocks/LandingPageBlocks/HeroBlock";
import SearchOrRedirectBlock from "../components/blocks/LandingPageBlocks/SearchOrRedirectBlock";
import SecondaryBlock from "../components/blocks/LandingPageBlocks/SecondaryBlock";
import SearchResults from "../components/blocks/SearchBlocks/SearchResults";
import LoginModal from "../components/ui/Modals/LoginModal";
import ProfileSetupModal from "../components/ui/Modals/ProfileSetupModal";
import ControlBar from "../components/players/ControlBar";
import Navbar from "../components/blocks/Navbar/Navbar";
import styled from "styled-components";

const SEARCH_TABS = [
  { label: "Everything", value: "everything" },
  { label: "Songs", value: "songs" },
  { label: "Artists", value: "artists" },
  { label: "Albums", value: "albums" },
  { label: "EPs", value: "eps" },
];

const Landing = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeFilter, setActiveFilter] = useState("everything");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query !== searchTerm) {
      setSearchTerm(query || "");
    }
  }, [searchParams]);

  useEffect(() => {
    const checkUserProfile = async () => {
      setIsChecking(true);

      if (currentUser) {
        try {
          const docRef = doc(firestore, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            navigate("/home", { replace: true });
            return;
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
        }
      }

      setIsChecking(false);
    };

    if (userLoggedIn !== undefined) {
      checkUserProfile();
    }
  }, [currentUser, navigate, userLoggedIn]);

  if (isChecking || userLoggedIn === undefined) {
    return (
      <LoadingContainer>
        <LoadingMessage>Loading...</LoadingMessage>
      </LoadingContainer>
    );
  }

  const openLoginModal = () => {
    setRegisterMode(false);
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setRegisterMode(true);
    setShowLoginModal(true);
  };

  const handleRegistered = (userId) => {
    setShowLoginModal(false);
    setProfileUserId(userId);
    setShowProfileSetup(true);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <>
      <MainWrapper>
        {searchTerm && (
          <Navbar
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
          />
        )}

        {!searchTerm ? (
          <>
            <HeroBlock
              openLoginModal={openLoginModal}
              openRegisterModal={openRegisterModal}
            />
            <SearchOrRedirectBlock />
            <SecondaryBlock
              openLoginModal={openLoginModal}
              openRegisterModal={openRegisterModal}
            />
          </>
        ) : (
          <SearchWrapper>
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

            <SearchContent>
              <SearchContentInner>
                <SearchResults
                  searchTerm={searchTerm}
                  activeFilter={activeFilter}
                  isGuestMode={true}
                />
              </SearchContentInner>
            </SearchContent>
          </SearchWrapper>
        )}
        <ControlBar />
      </MainWrapper>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialRegister={registerMode}
          onRegistered={handleRegistered}
        />
      )}
      {showProfileSetup && profileUserId && (
        <ProfileSetupModal
          userId={profileUserId}
          onComplete={() => setShowProfileSetup(false)}
        />
      )}
    </>
  );
};

const MainWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 120px;
  background: #232323;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #232323;
`;

const LoadingMessage = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
`;

const SearchWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
`;

const SearchHeader = styled.div`
  border-bottom: 1px solid #333;
  background: #191919;
  width: 100%;
  padding: 32px 0;
`;

const SearchHeaderContent = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 0 48px;
`;

const SearchQuery = styled.h1`
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 24px 0;

  span {
    color: #ff4343;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  background: ${(props) => (props.$active ? "#ff4343" : "transparent")};
  color: ${(props) => (props.$active ? "#fff" : "#888")};
  border: 1px solid ${(props) => (props.$active ? "#ff4343" : "#444")};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
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

export default Landing;
