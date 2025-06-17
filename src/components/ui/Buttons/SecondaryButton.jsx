import styled from "styled-components";

const SecondaryButton = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

const Container = styled.button`
  width: 154px;
  height: 54px;
  border-radius: 16px;
  background-color: #ff4343;
  color: #fff;
  font-size: 28px;
  border: none;
  padding: 0;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #923131;
  }
`;

export default SecondaryButton;
