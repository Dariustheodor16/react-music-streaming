import { useState } from "react";
import HeroBlock from "./components/blocks/LandingPageBlocks/HeroBlock";
import SecondaryBlock from "./components/blocks/LandingPageBlocks/SecondaryBlock";
import SearchOrRedirectBlock from "./components/blocks/LandingPageBlocks/SearchOrRedirectBlock";

function App() {
  return (
    <>
      <HeroBlock></HeroBlock>
      <SearchOrRedirectBlock></SearchOrRedirectBlock>
      <SecondaryBlock></SecondaryBlock>
    </>
  );
}

export default App;
