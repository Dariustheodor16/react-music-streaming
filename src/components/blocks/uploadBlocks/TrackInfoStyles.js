import styled from "styled-components";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;

  h1 {
    font-size: 3rem;
    color: #fff;
    margin-bottom: 12px;
    font-weight: 400;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 48px;
  margin-top: 24px;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 350px;
`;

export const Label = styled.label`
  color: #fff;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Input = styled.input`
  border-radius: 10px;
  background-color: #d9d9d9;
  color: #3d3131;
  border: none;
  height: 44px;
  width: 100%;
  padding-left: 16px;
  font-size: 1rem;
`;

export const TextArea = styled.textarea`
  border-radius: 10px;
  background-color: #d9d9d9;
  color: #3d3131;
  border: none;
  width: 336px;
  min-height: 80px;
  padding: 12px 16px;
  font-size: 1rem;
  resize: vertical;
`;

export const ErrorMsg = styled.div`
  color: #ff4343;
  margin-top: 12px;
`;

export const BottomButtonContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  background: rgba(35, 35, 35, 0.95);
  padding: 24px 0;
  z-index: 20;
`;

export const CloseButtonStyled = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;

  svg {
    width: 52px;
    height: 52px;
  }

  svg path {
    stroke: #fff;
  }

  &:hover svg path {
    stroke: #ff4343;
  }
`;

export const ProgressHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h2 {
    color: #fff;
    margin-bottom: 12px;
  }
`;

export const ProgressBar = styled.div`
  width: 300px;
  height: 8px;
  background: #444;
  border-radius: 4px;
  margin: 0 auto;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #ff4343;
  width: ${(props) => props.$width}%;
  transition: width 0.3s ease;
`;

export const AlbumInfo = styled.p`
  color: #ccc;
  margin-top: 8px;
  font-style: italic;
`;

export const FileName = styled.p`
  color: #999;
  font-size: 0.9rem;
  margin-top: 4px;
`;

export const BackButton = styled.button`
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 16px;

  &:hover {
    background: #fff;
    color: #000;
  }
`;

export const StyledPrimaryButton = styled(PrimaryButton)`
  white-space: nowrap !important;
  width: 218px !important;
  height: 54px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
`;
