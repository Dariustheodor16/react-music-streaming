import styled from "styled-components";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";

const QuitUploadModal = ({ open, onClose, onQuit }) => {
  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Content>
          <h1>Are you sure you want to quit?</h1>
          <p>Your changes will not be saved.</p>
        </Content>
        <Actions>
          <BackAnchor onClick={onClose}>Back to upload</BackAnchor>
          <PrimaryButton onClick={onQuit} style={{ minWidth: 120 }}>
            Quit
          </PrimaryButton>
        </Actions>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(24, 24, 24, 0.6);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  width: 1000px;
  height: 290px;
  background: #232323;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 83px;
  box-sizing: border-box;
`;

const Content = styled.div`
  h1 {
    color: #fff;
    font-size: 2.2rem;
    margin-bottom: 18px;
    font-weight: 500;
  }
  p {
    color: #d9d9d9;
    font-size: 1.2rem;
    margin: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 32px;
`;

const BackAnchor = styled.a`
  color: #d9d9d9;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: underline;
  margin-right: 24px;
`;

export default QuitUploadModal;
