import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import PrimaryInput from "../../ui/Inputs/PrimaryInput";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SearchOrRedirectBlock = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <div className="input-wrapper">
        <PrimaryInput />
      </div>
      <p>Or</p>
      <StyledPrimaryButton onClick={() => navigate("/info")}>
        Claim Your Stage
      </StyledPrimaryButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;

  .input-wrapper {
    width: 32vw;
    max-width: 500px;
    min-width: 180px;
    margin-bottom: 16px;
  }

  input {
    width: 100%;
    height: clamp(38px, 4vw, 56px);
    font-size: clamp(1rem, 1.2vw, 1.1rem);
    border-radius: 0.938vw;
  }

  p {
    color: #d9d9d9;
    font-size: 1.25vw;
    margin: 8px 0;
  }

  @media (max-width: 600px) {
    .input-wrapper {
      width: 90vw;
      min-width: 0;
    }
    input {
      font-size: 1rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const StyledPrimaryButton = styled(PrimaryButton)`
  width: 224px !important;
  height: 54px !important;
  font-size: 24px;
  white-space: nowrap;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
`;

export default SearchOrRedirectBlock;
