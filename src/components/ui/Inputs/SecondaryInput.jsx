import styled from "styled-components";

const SecondaryInput = ({ type, placeholder, ...props }) => {
  return (
    <Container>
      <StyledInput type={type} placeholder={placeholder} {...props} />
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
  border: none;
  height: 54px;
  width: 100%;
  box-sizing: border-box; /* Add this line */
  padding-left: 24px; /* Add your desired padding */
  text-align: left;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &::placeholder {
    font-size: 16px;
    text-align: left;
  }
`;

export default SecondaryInput;
