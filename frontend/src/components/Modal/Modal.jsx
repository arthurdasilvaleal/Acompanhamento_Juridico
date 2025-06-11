import { ModalOverlay, ModalContent, CloseButton } from './style'

export default function Modal({ isOpen, onClose, message, messageError }) {
  if (!isOpen) return null
  return (
    
    <ModalOverlay>
      <ModalContent $SucessBorder={messageError === ""}>
        <CloseButton onClick={onClose}>×</CloseButton>
        {messageError === "" ? (
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

/* Exemplo de uso:
    const [isModalOpen, set_ModalOpen] = useState(false)
    const [formStatusMessage, set_FormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_fromStatusErrorMessage] = useState("")

    <Modal isOpen={isModalOpen} onClose={() => set_ModalOpen(false)} message={formStatusMessage} messageError={fromStatusErrorMessage}/>
*/