import styled from "styled-components";

const EmptyState = ({ title, subtitle }) => {
  return (
    <EmptyStateContainer>
      <EmptyStateText>{title}</EmptyStateText>
      <EmptyStateSubtext>{subtitle}</EmptyStateSubtext>
    </EmptyStateContainer>
  );
};

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
`;

const EmptyStateText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8px;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  color: #d9d9d9;
`;

export default EmptyState;
