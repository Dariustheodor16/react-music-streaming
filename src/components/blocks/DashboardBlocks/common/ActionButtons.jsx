import styled from "styled-components";

const ActionButtons = ({ children }) => {
  return <ActionButtonsContainer>{children}</ActionButtonsContainer>;
};

ActionButtons.GoTo = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

ActionButtons.Icon = styled.button`
  background: ${({ $danger }) =>
    $danger ? "rgba(255, 67, 67, 0.1)" : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${({ $danger }) =>
      $danger ? "rgba(255, 67, 67, 0.3)" : "rgba(255, 255, 255, 0.2)"};
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ $danger }) => ($danger ? "#ff4343" : "#fff")};
  }

  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(255, 67, 67, 0.2)" : "rgba(255, 255, 255, 0.2)"};
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export default ActionButtons;
