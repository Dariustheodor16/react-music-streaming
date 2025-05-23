import styled from "styled-components";

const SecondaryButton = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

const Container = styled.button`
  border-radius: 0.833vw;
  background-color: #ff4343;
  color: #fff;
  font-size: 1.25vw;
  border: none;
  padding: 0.5em 2vw;
  height: 2.813vw;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #923131;
  }
`;

export default SecondaryButton;
