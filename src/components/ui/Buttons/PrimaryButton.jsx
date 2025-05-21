import styled from "styled-components";

const PrimaryButton = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
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
  &:hover {
    background-color: #9c9c9c;
    color: #fff;
  }
`;

export default PrimaryButton;
