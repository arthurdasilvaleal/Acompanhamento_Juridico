import { ModalOverlay, ModalContent, CloseButton } from './style'

export default function Modal({ isOpen, onClose, message, sucess, messageError }) {
  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        {sucess === true ? (
            <>
                <h2 style={{ color: 'green' }}>Sucesso!</h2>
                <p>{message}</p>
            </>
        ) : (
            <>
                <h2 style={{ color: 'red' }}>Erro</h2>
                <p>{message}</p>
                <p style={{ fontSize: '13px' }}>Detalhes: {messageError}</p>
            </>
        )}
      </ModalContent>
    </ModalOverlay>
  )
}
