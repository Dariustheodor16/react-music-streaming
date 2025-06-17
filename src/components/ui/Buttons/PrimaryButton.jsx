import styled from "styled-components";

const PrimaryButton = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};

const Container = styled.button`
  width: 154px;
  height: 54px;
  border-radius: 12px;
  background-color: #d9d9d9;
  color: #3d3131;
  font-size: 28px;
  font-weight: 200;
  border: none;
  padding: 8px 28px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #9c9c9c;
    color: #fff;
  }
`;

export default PrimaryButton;
