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
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &:hover {
    color: ${({ $active }) => ($active ? "#fff" : "#ff4343")};
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

export const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
`;

export const ErrorText = styled.div`
  background: rgba(255, 67, 67, 0.1);
  border: 1px solid #ff4343;
  border-radius: 8px;
  padding: 20px;
  color: #ff4343;
  text-align: center;
  max-width: 400px;
`;

export const SongsOnlyGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
`;

export const AlbumsOnlyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  gap: 24px;
`;

export const Left = styled.div`
  flex: 0 0 248px;
`;

export const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EmptySpace = styled.div`
  flex: 0 0 248px;
`;

export const EverythingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 0 20px;

  .song-item {
    grid-column: 1 / -1;
  }
`;

export const PlaylistItem = styled.div`
  display: flex;
  justify-content: center;
`;

export const SongItemWide = styled.div`
  width: 100%;
  max-width: 723px;
  margin: 0 auto;
  grid-column: 1 / -1;
`;

export const SongItemMedium = styled.div`
  width: 100%;
`;
