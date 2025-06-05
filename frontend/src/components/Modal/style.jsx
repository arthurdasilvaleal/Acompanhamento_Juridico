import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ModalContent = styled.div`
  background: #fff;
  padding: 24px 32px;
  border-radius: 12px;
  max-width: 400px;
  width: 50%;
  border: ${({ $SucessBorder }) => $SucessBorder ? "2px solid green" : "2px solid red"};
  text-align: center;
  position: relative;
  color: #000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #CDAF6F;
`
