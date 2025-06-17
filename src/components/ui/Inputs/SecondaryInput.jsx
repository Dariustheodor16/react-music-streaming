import styled from "styled-components";

const SecondaryInput = ({ type, placeholder, error, ...props }) => {
  return (
    <Container>
      <StyledInput
        type={type}
        placeholder={placeholder}
        $hasError={!!error}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 512px;
`;

const StyledInput = styled.input`
  border-radius: 16px;
  background-color: #d9d9d9;
  color: #3d3131;
  border: ${({ $hasError }) => ($hasError ? "2px solid #ff4343" : "none")};
  height: 54px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 24px;
  text-align: left;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: border-color 0.2s ease;

  &::placeholder {
    font-size: 16px;
    text-align: left;
    color: ${({ $hasError }) => ($hasError ? "#ff4343" : "#666")};
  }

  &:focus {
    outline: none;
    border: 2px solid ${({ $hasError }) => ($hasError ? "#ff4343" : "#007bff")};
  }
`;
const ErrorText = styled.p`
  color: #ff4343;
  font-size: 12px;
  margin: 4px 0 0 0;
  padding-left: 4px;
`;

export default SecondaryInput;
