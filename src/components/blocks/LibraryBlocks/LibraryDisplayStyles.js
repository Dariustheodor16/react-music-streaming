import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100vw;
  max-width: 1190px;
  padding-top: 12px;
  margin: 0 auto;
  box-sizing: border-box;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
  margin-left: 8px;
  margin-top: 0;
`;

export const TabButton = styled.button`
  background: ${({ $active }) => ($active ? "#ff4343" : "none")};
  border: none;
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 32px;
  height: 42px;
  min-width: 192px;
  border-radius: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &:hover {
    color: ${({ $active }) => ($active ? "#fff" : "#ff4343")};
    background: ${({ $active }) =>
      $active ? "#ff4343" : "rgba(255, 67, 67, 0.1)"};
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

export const LoadingMessage = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 32px;
  max-width: 600px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

export const EmptyMessage = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 32px;
  max-width: 600px;
`;

export const SongsOnlyGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
`;

export const SongItemWide = styled.div`
  grid-column: 1 / -1;
  width: 100%;

  > div {
    width: 100% !important;
    max-width: 1190px !important;
  }
`;
