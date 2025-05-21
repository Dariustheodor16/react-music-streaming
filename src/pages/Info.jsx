import Navbar from "../components/blocks/Navbar/Navbar";
import HeroBlock from "../components/blocks/InfoBlocks/HeroBlock";
import InfoTextCard from "../components/ui/Cards/InfoTextCard";
import CardsLayout from "../components/blocks/InfoBlocks/CardsLayout";

const Info = () => {
  return (
    <>
      <Navbar></Navbar>
      <HeroBlock></HeroBlock>
      <CardsLayout></CardsLayout>
    </>
  );
};

export default Info;
