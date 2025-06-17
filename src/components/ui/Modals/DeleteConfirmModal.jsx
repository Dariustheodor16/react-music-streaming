import styled from "styled-components";

const DeleteConfirmModal = ({ type, name, onConfirm, onCancel }) => {
  return (
    <Modal>
      <Overlay onClick={onCancel} />
      <Content>
        <Title>Delete {type}</Title>
        <Message>
          Are you sure you want to delete "{name}"? This action cannot be
          undone.
          {type === "album" && " All songs in this album will also be deleted."}
        </Message>
        <Buttons>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>Delete</ConfirmButton>
        </Buttons>
      </Content>
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #191919;
  border-radius: 12px;
  padding: 32px;
  min-width: 400px;
  max-width: 500px;
`;

const Title = styled.h3`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  text-transform: capitalize;
`;

const Message = styled.p`
  color: #d9d9d9;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 32px 0;
`;

const Buttons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #444;
  }
`;

const ConfirmButton = styled.button`
  background: #ff4343;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #ff6666;
  }
`;

export default DeleteConfirmModal;
