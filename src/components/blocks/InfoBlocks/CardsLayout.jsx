import InfoTextCard from "../../ui/Cards/InfoTextCard";
import styled from "styled-components";

const CardsLayout = () => {
  return (
    <Container>
      <InfoTextCard
        title="Real-Time Stats"
        text="Keep tabs on your top-performing tracks by monitoring total plays and fan engagement."
      />
      <InfoTextCard
        title="Community feedback"
        text="Receieve comments on your tracks and build a relationship with your fans."
      />
      <InfoTextCard
        title="Be Heard Everywhere"
        text="From your first upload to global recognition, join a community where every voice counts and gets played."
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export default CardsLayout;
