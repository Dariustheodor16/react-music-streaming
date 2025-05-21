import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import PrimaryInput from "../../ui/Inputs/PrimaryInput";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SearchOrRedirectBlock = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <PrimaryInput></PrimaryInput>
      <p>Or</p>
      <PrimaryButton onClick={() => navigate("/info")}>
        Claim Your Stage
      </PrimaryButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;

  p {
    color: #d9d9d9;
    font-size: 1.25vw;
  }
`;

export default SearchOrRedirectBlock;
