import styled from "styled-components";
import SearchIcon from "../../../assets/icons/search.svg?react";

const PrimaryInput = ({ placeholder = "Search for songs, artists, albums", ...props }) => {
  return (
    <Container>
      <StyledInput
        type="text"
        placeholder={placeholder}
        {...props}
      />
      <IconWrapper>
        <SearchIcon />
      </IconWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 490px;
`;

const StyledInput = styled.input`
  border-radius: 16px;
  background-color: #d9d9d9;
  color: #3d3131;

  border: none;
  padding-left: 20px;
  height: 54px;
  width: 100%;
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

const IconWrapper = styled.span`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  height: 18px;
  width: 18px;
`;

export default PrimaryInput;
