import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import PrimaryInput from "../../ui/Inputs/PrimaryInput";
import styled from "styled-components";

const SearchOrRedirectBlock = () => {
  return (
    <Container>
      <PrimaryInput></PrimaryInput>
      <p>Or</p>
      <PrimaryButton>Claim Your Stage</PrimaryButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    color: #d9d9d9;
    font-size: 1.25vw;
  }
`;

export default SearchOrRedirectBlock;
