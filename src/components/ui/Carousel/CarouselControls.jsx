import styled from "styled-components";
import RightCircleIcon from "../../../assets/icons/right-circle.svg?react";

const CarouselControls = ({
  onScrollLeft,
  onScrollRight,
  canScrollLeft,
  canScrollRight,
}) => {
  return (
    <ControlsContainer>
      <CarouselButton
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        $rotate={true}
        style={{
          opacity: canScrollLeft ? 1 : 0,
          pointerEvents: canScrollLeft ? "auto" : "none",
        }}
      >
        <RightCircleIcon />
      </CarouselButton>
      <CarouselButton
        onClick={onScrollRight}
        disabled={!canScrollRight}
        style={{
          opacity: canScrollRight ? 1 : 0,
          pointerEvents: canScrollRight ? "auto" : "none",
        }}
      >
        <RightCircleIcon />
      </CarouselButton>
    </ControlsContainer>
  );
};

const ControlsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CarouselButton = styled.button`
  background: rgba(35, 35, 35, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${({ $rotate }) => ($rotate ? "rotate(180deg)" : "none")};
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  svg {
    width: 24px;
    height: 24px;
    fill: #fff;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  &:hover:not(:disabled) {
    background: rgba(255, 67, 67, 0.9);
    border-color: rgba(255, 67, 67, 0.8);
    transform: ${({ $rotate }) =>
      $rotate ? "rotate(180deg) scale(1.1)" : "scale(1.1)"};
    box-shadow: 0 6px 16px rgba(255, 67, 67, 0.3);
  }

  &:disabled {
    opacity: 0;
    cursor: not-allowed;
    transform: ${({ $rotate }) =>
      $rotate ? "rotate(180deg) scale(0.8)" : "scale(0.8)"};
    pointer-events: none;
  }
`;

export default CarouselControls;
