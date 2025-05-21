import HeroBlock from "../components/blocks/LandingPageBlocks/HeroBlock";
import SearchOrRedirectBlock from "../components/blocks/LandingPageBlocks/SearchOrRedirectBlock";
import SecondaryBlock from "../components/blocks/LandingPageBlocks/SecondaryBlock";

const Home = () => {
  return (
    <>
      <HeroBlock></HeroBlock>
      <SearchOrRedirectBlock></SearchOrRedirectBlock>
      <SecondaryBlock></SecondaryBlock>
    </>
  );
};

export default Home;
