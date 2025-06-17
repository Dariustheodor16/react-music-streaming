import styled from "styled-components";

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <Container>
      <LoadingMessage>{message}</LoadingMessage>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 32px 0 40px 0;
`;

const LoadingMessage = styled.div`
  color: #d9d9d9;
  font-size: 18px;
  text-align: center;
  padding: 80px 0;
`;

export default LoadingState;
