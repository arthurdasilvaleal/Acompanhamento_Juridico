import { Grid_Box, Search_box, Consult_button, Card_Cliente, ShowClientes, PaginationContainer, PaginationInfo, PaginationControls, PaginationButton, PaginationNumbers, PaginationNumber } from "./style"
import { useState, useEffect } from "react"
import { UserPlusIcon } from "@heroicons/react/20/solid"
import { motion, AnimatePresence } from "framer-motion"
import Modal from "../../../../components/Modal/Modal"
import Clientes from "./Add_Clientes/Clientes"
import Loading from "../../../../components/Loading_Form/Loading"
import Particles from "../../../../components/Particles/ParticlesBackground"
import axios from "axios"

export default function Consulta_Cliente({ TipoColaborador, active }){

    // Clientes adicionados
    const [allClientes, set_allClientes] = useState([]) 
    const [filterClientes, set_filterClientes] = useState("")
    const filter = allClientes.filter(cliente => cliente.nm_Cliente.toLowerCase().includes(filterClientes.toLocaleLowerCase()))

    // Estados para paginação
    const [currentPage, set_currentPage] = useState(1)
    const [itemsPerPage] = useState(20)
    const totalPages = Math.ceil(filter.length / itemsPerPage)
    
    // Calcular clientes da página atual
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentClientes = filter.slice(startIndex, endIndex)

    // Variáveis de Estado
    const [firstRender, set_firstRender] = useState(false)
    const [addCliente, set_addCliente] = useState(false) // Abre o form para inserir um novo cliente
    const [Loading_clientes, setLoading_clientes] = useState(false)
    const [cardOpen, set_cardOpen] = useState(null)
    const [cardVeryDetailed, set_cardVeryDetailed] = useState(null)
    const [addedCliente, set_addedCliente] = useState(false) // Puxa os clientes após uma inserção
    const [editCliente, set_editCliente] = useState(false) // abre o form para alterar o cliente
    const [ClienteInfo, set_clienteInfo] = useState([])
    const [DeleteCliente, set_DeleteCliente] = useState(null)

    // Variáveis do modal
    const [isModalOpen, set_ModalOpen] = useState(false)
    const [formStatusMessage, set_FormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_formStatusErrorMessage] = useState("")
    const [deleteDialog, set_deleteDialog] = useState(false) // Caso tenha função de deletar
    const [deleteConfirm, set_deleteConfirm] = useState(false)

    // Função para chamar todos os clientes
    const getAllClientes = async () => {
        setLoading_clientes(true)

        try{
            const response = await axios.get("http://localhost:5000//get_Allclientes")
            console.log(response.data)
            set_allClientes(response.data)

            setLoading_clientes(false)
        }catch(error){
            console.log(error)
            setLoading_clientes(false)
        }
    }

    // Pegando os clientes (também pega após uma inserção)
    useEffect(() => {
        if(!firstRender){
            set_firstRender(true)
            getAllClientes()
        }

        if(addedCliente){
            getAllClientes()
            set_addedCliente(false)
        }
    }, [firstRender, addedCliente])

    // Resetar página quando filtro mudar
    useEffect(() => {
        set_currentPage(1)
    }, [filterClientes])


    // Ordena os cards pelo que foi clicado em "ver mais detalhes"
    const orderedClientes = [...currentClientes].sort((e) => {
        if(e.cd_Cliente === cardVeryDetailed) 
            return -1 // a Vem antes
        return 0 // Mantem a ordem
    })

    // Deletando os Clientes
    useEffect(() => {
        if(deleteConfirm){
            (async () => {
                try{
                    const response = await axios.delete("http://localhost:5000/delete_cliente", { 
                        data: { DeleteCliente },
                        headers: { "Content-Type": "application/json" }
                    })
                    console.log(response)
                    set_deleteDialog(false)
                    set_formStatusErrorMessage("")
                    set_FormStatusMessage("Cliente deletado com sucesso!")
                    getAllClientes()
                    set_cardVeryDetailed(null)
                } catch (error){
                    set_deleteDialog(false)
                    set_FormStatusMessage("Erro ao deletar Cliente")
                    set_formStatusErrorMessage(error.response.data.error)
                }
            })()
        }
        set_deleteConfirm(false)
    }, [deleteConfirm])

    // Mandando os parametros para o componente "Clientes.jsx"
    const clienteWindowProps = {
        showWindow: addCliente, 
        setShowWindow: set_addCliente, 
        setaddedCliente: set_addedCliente, 
        showEditwindow: editCliente, 
        setShowEditwindow: set_editCliente,
        editInfo: ClienteInfo
    }

    const clienteModalProps = {
        isOpen: isModalOpen, 
        onClose: () => set_ModalOpen(false),
        message: formStatusMessage, 
        messageError: fromStatusErrorMessage, 
        DeleteConfirmation: deleteDialog, 
        setConfirmation: set_deleteConfirm
    }

    // Funções de navegação da paginação
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            set_currentPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            set_currentPage(currentPage - 1)
        }
    }

    const goToPage = (page) => {
        set_currentPage(page)
    }

    return(
        <>
            <ShowClientes $addClientes={addCliente} $editClientes={editCliente}>
            <Particles />
                {Loading_clientes && (<Loading setDOM={true} />)}
                <Search_box>
                    <label htmlFor="input" id="desktopLabel">Nome do cliente</label>
                    <label htmlFor="input" id="mobileLabel">Nome</label>
                    <input type="text" id="input" onChange={(e) => set_filterClientes(e.target.value)}/>
                    <Consult_button type="button" onClick={() => set_addCliente(prev => !prev)}>
                            <p>Adicionar Cliente</p>
                            <UserPlusIcon />
                    </Consult_button>
                </Search_box>
                
                <Grid_Box>
                    
                    <AnimatePresence>
                        {orderedClientes.map((cliente) => {

                            const isOpen = cardOpen === cliente.cd_Cliente
                            const veryDetailed = cardVeryDetailed === cliente.cd_Cliente
                            const isFullDetailed = cardVeryDetailed !== null 
                            ? veryDetailed // Só o selecionado fica visível
                            : true // todos aparecem

                            // Formatando e exibindo o CPF ou CNPJ dinamicamente
                            const codigoParte = () => {

                                if(cliente.cd_CPF == null)
                                    return cliente.cd_CNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
                                return cliente.cd_CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                            }

                            // Alguns endereços não possuem complementos, removendo o espaço em branco
                            const ComplementoEndereco = () => {
                                if(cliente.ds_ComplementoEndereco === null)
                                    return null
                                return(
                                    <p>{cliente.ds_ComplementoEndereco}</p>
                                ) 
                            }

                            const formatedPhone = cliente.cd_Telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")

                            return(
                                <motion.div
                                    key={cliente.cd_Cliente}
                                    layout="position"  // layout sozinho causa o bug "elastico" ao mudar a largura
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card_Cliente $detailed={isOpen} $fullDetailed={isFullDetailed} key={cliente.cd_Cliente} onClick={() => {
                                        if(!veryDetailed) set_cardOpen(isOpen ? null : cliente.cd_Cliente)
                                        }}>
                                        <div className="card-Content">
                                            <p className="title"><strong>{cliente.nm_Cliente}</strong></p>
                                            <p>{codigoParte()}</p>
                                            <p>{formatedPhone}</p>
                                            <p className="email">{cliente.ds_Email}</p>
                                            <hr />
                                            <p>{cliente.nm_Logradouro}, Nº {cliente.cd_NumeroEndereco}</p>
                                            <p>{cliente.nm_Bairro}</p>
                                            {ComplementoEndereco()}
                                            <p>{cliente.nm_Cidade}, {cliente.sg_Estado}</p>
                                            <br />
                                            <div>
                                                <h6 onClick={(e) => {
                                                    e.stopPropagation() // Evita que o Pai escute o evento
                                                    set_cardVeryDetailed(veryDetailed ? null : cliente.cd_Cliente)
                                                    }}>{veryDetailed ? "voltar" : "ver mais detalhes"}
                                                </h6>
                                                <h6 onClick={(e) => {
                                                    e.stopPropagation()
                                                    set_clienteInfo({
                                                        cdCliente: cliente.cd_Cliente,
                                                        nmCliente: cliente.nm_Cliente,
                                                        cdCPF: cliente.cd_CPF,
                                                        cdCNPJ: cliente.cd_CNPJ,
                                                        cdTelefone: cliente.cd_Telefone,
                                                        cdCEP: cliente.cd_CEP,
                                                        nmLogradouro: cliente.nm_Logradouro,
                                                        nmBairro: cliente.nm_Bairro,
                                                        nmCidade: cliente.nm_Cidade,
                                                        sgEstado: cliente.sg_Estado,
                                                        cdNumeroEndereco: cliente.cd_NumeroEndereco,
                                                        nmComplemento: cliente.ds_ComplementoEndereco,
                                                        dsEmail: cliente.ds_Email
                                                    })
                                                    // console.log(ClienteInfo)
                                                    window.scrollTo({
                                                        top: 1,
                                                        behavior: "smooth"
                                                    })
                                                    set_editCliente(prev => !prev)
                                                }}>Editar</h6>
                                                {TipoColaborador != "Estagiário" && (
                                                    <h6 className="Delete" onClick={(e) => {
                                                        e.stopPropagation()
                                                        set_ModalOpen(true)
                                                        set_deleteDialog(true)
                                                        set_FormStatusMessage("cliente " + cliente.nm_Cliente)
                                                        set_DeleteCliente(cliente.cd_Cliente)
                                                    }}>Deletar</h6>
                                                )}
                                            </div>
                                            {/* Quando o usuário clicar em "ver mais detalhes" */}
                                            {veryDetailed && cliente.cd_numProcessos != null && (
                                                <>
                                                    <hr style={{ height: "3px", backgroundColor: "#CDAF6F", border: "none", boxShadow: "0 0 30px #CDAF6F" }}/>
                                                    <h4><strong>Processos</strong></h4>
                                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                                        {(cliente.cd_numProcessos).split("@").map((item, index) => 
                                                            <p key={index} style={{ textAlign: "center" }}>{item}</p>)
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Card_Cliente>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </Grid_Box>

                {/* Controles de Paginação */}
                {totalPages > 1 && (
                    <PaginationContainer>
                        <PaginationInfo>
                            Página {currentPage} de {totalPages} ({filter.length} clientes)
                        </PaginationInfo>
                        
                        <PaginationControls>
                            <PaginationButton 
                                onClick={goToPreviousPage} 
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </PaginationButton>
                            
                            <PaginationNumbers>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <PaginationNumber
                                        key={page}
                                        $active={currentPage === page}
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </PaginationNumber>
                                ))}
                            </PaginationNumbers>
                            
                            <PaginationButton 
                                onClick={goToNextPage} 
                                disabled={currentPage === totalPages}
                            >
                                Próximo
                            </PaginationButton>
                        </PaginationControls>
                    </PaginationContainer>
                )}
            </ShowClientes>
            <Clientes {...clienteWindowProps}/>
            <Modal {...clienteModalProps}/>
        </>
    )
}