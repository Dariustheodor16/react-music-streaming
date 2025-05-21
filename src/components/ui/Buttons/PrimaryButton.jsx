import styled from "styled-components";

const PrimaryButton = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container = styled.button`
  border-radius: 0.833vw;
  background-color: #d9d9d9;
  color: #3d3131;
  font-size: 1.25vw;
  border: none;
  padding: 0.5em 2vw;
  height: 2.813vw;
  text-align: center;
  cursor: pointer;
`;

export default PrimaryButton;
