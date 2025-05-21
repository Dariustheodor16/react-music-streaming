import styled from "styled-components";

const InfoTextCard = ({ title, text }) => {
  return (
    <Container>
      <h1>{title}</h1>
      <p>{text}</p>
    </Container>
  );
};

const Container = styled.div`
  width: 90vw;
  max-width: 321px;
  min-width: 220px;
  height: auto;
  padding: 2rem 1.5rem;
  background: #121212;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #fff;
    text-align: left;
    font-weight: 300;
  }

  p {
    font-size: 1rem;
    color: #d9d9d9;
    text-align: left;
  }
`;

export default InfoTextCard;
