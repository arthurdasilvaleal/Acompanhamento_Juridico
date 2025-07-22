import { ModalOverlay, ModalContent, CloseButton, Confirmation_button } from './style'
import ReactDOM from 'react-dom'

export default function Modal({ isOpen, onClose, message, messageError, DeleteConfirmation, setConfirmation }) {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent $SucessBorder={messageError === "" && DeleteConfirmation === false} $ConfirmBorder={DeleteConfirmation !== false}>
        <CloseButton onClick={onClose}>×</CloseButton>
        { DeleteConfirmation !== false ?(
            <>
                  <h2 style={{ color: "orange" }}>Deletar {message}?</h2>
                  <p>Tem certeza que deseja deletar?</p>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <Confirmation_button onClick={() => setConfirmation(true)}>Deletar</Confirmation_button>
                    <Confirmation_button onClick={onClose}>Cancelar</Confirmation_button>
                  </div>
            </>
        ) : messageError === "" ? (
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
    </ModalOverlay>, document.body
  )
}

/* Exemplo de uso:
    const [isModalOpen, set_ModalOpen] = useState(false)
    const [formStatusMessage, set_FormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_fromStatusErrorMessage] = useState("")
    const [deleteMessage, set_deleteMessage] = useState(false) // Caso tenha função de deletar
    const [deleteConfirm, set_deleteConfirm] = useState(false)

    <Modal isOpen={isModalOpen} onClose={() => set_ModalOpen(false)} message={formStatusMessage} messageError={fromStatusErrorMessage}/>
*/