import { useState, useEffect, useMemo } from "react"
import { Consult_form, Consult_button, Twin_Button, NotFound_Error, InputError } from "./style"
import { Process_Cards, Card, Card_Title, First_info, Consult_IntForm, Consult_TaskForm } from "./style"
import { Intimacao_card, Task_card, Edit_taskForm, StyledSelect } from "./style"
import Processo from "./Add_Processos/Processo"
import Modal from "../../../../components/Modal/Modal"
import Loading_Form from "../../../../components/Loading_Form/Loading"
import axios from "axios"
import { PencilSquareIcon } from "@heroicons/react/20/solid"
import { PlusIcon } from "@heroicons/react/24/outline"
import { useMediaQuery } from "react-responsive"

export default function Consulta_Processo({ CodigoColaborador, TipoColaborador, NomeColaborador }){

    // Dados dos Processos
    const [cd_NumeroProcesso, set_cdNumeroEndereco] = useState("")
    const [cd_ListNumeroProcesso, set_cdListNumeroProcesso] = useState([]) // Datalist com os numero dos processos do banco
    const [nm_Cliente, set_nmCliente] = useState("Carlos Silva")
    const [processos, set_Processos] = useState([]) // Guardar os processos
    const [Intimacoes, set_Intimacoes] = useState([]) // Guardar as intimações de cada processo
    const [Tarefas, set_Tarefas] = useState([]) // Guardar as tarefas de cada processo

    // Váriáveis de Estado
    const [foundProcess, set_foundProcess] = useState(false) // Achou processo
    const [notFound, set_NotFound] = useState(false) // Caso não ache um processo
    const [openCardId, set_OpenCardId] = useState(null) // Abre o card da intimação
    const [CloseForm, set_CloseForm] = useState(true) // Tampar o formulario
    const [OpenAddInt, set_OpenAddInt] = useState(true)
    const [openAddProcess, set_openAddProcess] = useState(false) // Abrir a janela de adicionar processo
    const [firstContact, set_firstContact] = useState(true)// apenas para mobile (evita aquele buraco de merda)
    const [openFormIdTask, set_openFormIdTask] = useState(null) // Abre o formulário de addTarefa de cada card
    const [openTaskId, set_openTaskId] = useState(null) // Abre cada card de tarefas para uma unica intimação por vez
    const [Loading, set_Loading] = useState(false) // Loading da busca de processos
    const [OpenEditProcess, set_OpenEditProcess] = useState(false) // Abre a janela para edição de um processo
    const [PropEditProcess, set_PropEditProcess] = useState([]) // Props para edição de processo
    const [addedProcess, set_addedProcess] = useState(false) // Para quando um processo for adicionado, o sistema pega o numero do processo para mostrar
    const [editProcess, set_editProcess] = useState(false) // Para quando um processo for editado, apos os dados forem validados, eles voltam atualizados
    const [deleteProcess, set_DeleteProcess] = useState(null) // Para armazenar o código do processo e mandá-lo para exclusão
    const [editTaskSvg, set_editTaskSvg] = useState(false) // Controla a ação de editar um card de tarefa
    const [selectTypeTask, set_selectTypeTask] = useState("") // Controla o tipo de tarefa que aparece no select seguinte
    const isMobile = useMediaQuery({ maxWidth: 768 })

    // Para o formulario de edição de cada tarefa
    const [edit_dtPrazo, set_edit_dtPrazo] = useState("")
    const [edit_cdStatus, set_edit_cdStatus] = useState("")
    const [edit_dsTarefa, set_edit_dsTarefa] = useState("")
    const [edit_PrimarySelect, set_edit_PrimarySelect] = useState("")
    const [edit_cdTipoTarefa, set_edit_cdTipoTarefa] = useState("")

    // Variáveis do Modal
    const [isModalOpen, set_ModalOpen] = useState(false)
    const [formStatusMessage, set_FormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_formStatusErrorMessage] = useState("")
    const [deleteDialog, set_deleteDialog] = useState(false) // Abre a caixa de confirmação de Delete
    const [deleteConfirm, set_deleteConfirm] = useState(false) // Para confirmar o Delete

    // Variável dos formulários de cada card
    const [formData, set_FormData] = useState({})
    const [taskFormData, set_taskFormData] = useState({})

    // Função que separa cada formulario de intimação de cada processo
    const handleCardChange = (processoId, field, value) => {
        set_FormData(prev => ({
            ...prev,
            [processoId]: {
                ...prev[processoId],
                [field]: value
            }
        }))
    }

    // Função que separa cada formulário de tarefa de cada intimação
    const handleTaskChange = (intimacaoId, field, value) => {
        set_taskFormData(prev => ({
            ...prev,
            [intimacaoId]: {
                ...prev[intimacaoId],
                [field]: value
            }
        }))
    }

    // Pegando os numeros dos processos
    useEffect(() => {
        axios.get("http://localhost:5000/get_processos?only=id")
          .then(response => {
            set_cdListNumeroProcesso(response.data)
          })
          .catch(error => {
            console.error("Erro ao buscar processos:", error)
          }
        ) 
        if(addedProcess) set_addedProcess(false)
    }, [ , addedProcess])

    // Pesquisando o processo (por nome e/ou numero)
    const getProcessSubmit = async (e) => {

        window.scrollTo({
            top: 1,
            behavior: "smooth"
        })

        e.preventDefault()
        set_firstContact(false)
        set_Loading(true)

        if(foundProcess){
            set_foundProcess(false)
            set_Loading(false)
            document.body.style.overflow = "hidden"
        }else{

            try{
                const response = await axios.get("http://localhost:5000/get_processos", {
                    params: { id_processo: cd_NumeroProcesso, parte: nm_Cliente }
                })

                if(response.data.length > 0){
                    console.log(response.data)
                    set_Processos(response.data)
                    set_foundProcess(true)
                    set_NotFound(false)
                    CatchIntInfo()
                    // CatchTaskInfo()
                    document.body.style.overflow = "visible"
                }
                else{
                    if(processos.length > 0){document.body.style.overflow = "hidden"}
                    set_foundProcess(false)
                    set_NotFound(true)
                }
                set_Loading(false)
            }catch(error){
                console.error("Erro ao buscar processo:", error)
                set_NotFound(true)
                set_Loading(false)
            }
        }
    }

    // Apenas para remover o "buraco" em baixo deixado pelo componente de adicionar processo
    if(firstContact){document.body.style.overflow = "hidden"}
    if(openAddProcess){document.body.style.overflow = "visible"}
    else if(notFound){
        document.body.style.overflow = "hidden"
        window.scrollTo({
            top: 1,
            behavior: "smooth"
        })
    }
    // else{document.body.style.overflow = "hidden"}

    // Bloqueando a barra de rolagem Y na hora de abrir/fechar o card e achando um processo(DEPRECATED)
    // useEffect(() => {
        
    //     if(foundProcess || !CloseForm){document.body.style.overflow = "hidden"}

    //     const timeout = setTimeout(() =>{
    //         document.body.style.overflow = ""
    //     }, 1000)

    //     return () => clearTimeout(timeout) // Por segurança, para evitar bugs
        
    // }, [CloseForm, foundProcess])

    // Função para pegar a data e hora da postagem
    function getTodayDate(){
        const DateNow = new Date()
        const data = DateNow.toISOString().slice(0, 10) // Extrai os primeiros 10 caracters convertidos
        const hora = DateNow.getHours().toString().padStart(2, '0')
        const minutos = DateNow.getMinutes().toString().padStart(2, '0')
        const segundos = DateNow.getSeconds().toString().padStart(2, '0')
        const FormatedDateTime = `${data} ${hora}:${minutos}:${segundos}`
        return FormatedDateTime
    }

    // Enviando os dados dos formularios dos cards
    const PostIntimaçãoSubmit = async (e, id) => {
        e.preventDefault()

        const IntimacaoData = {
            dataRecebimento: getTodayDate(),
            descricaoIntimacao: formData[id].ds_Intimacao,
            codigoProcesso: id
        }

        try{
            const response = await axios.post("http://localhost:5000/post_card?form=intimacao", IntimacaoData)
            set_ModalOpen(true)
            set_FormStatusMessage("Intimação adicionada com sucesso!")
            set_formStatusErrorMessage("")

            set_FormData(prev => ({
                ...prev,
                [IntimacaoData.codigoProcesso]: {
                    ...prev[IntimacaoData.codigoProcesso],
                    ds_Intimacao: ''
                }
            }))

            CatchIntInfo()
            
        }catch(error){
            console.error("Erro ao adicionar Intimação:", error)
            set_ModalOpen(true)
            set_FormStatusMessage("Erro ao adicionar Intimação")
            set_formStatusErrorMessage(error.response.data.Erro)
        }
    }

    const PostTaskSubmit = async (e, id) => {
        e.preventDefault()

        console.log(taskFormData[id].dt_Prazo + "\n" + taskFormData[id].nm_StatusTarefa + "\n" + taskFormData[id].cd_TipoTarefa + "\n" + taskFormData[id].ds_Tarefa + "\n" + getTodayDate() + "\n" + "Colaborador: " + CodigoColaborador)
        
        const taskData ={
            idIntimacao: id,
            dataPrazo: taskFormData[id].dt_Prazo,
            StatusTarefa: taskFormData[id].nm_StatusTarefa,
            DescricaoTarefa: taskFormData[id].ds_Tarefa,
            DataRecebimento: getTodayDate(),
            idTipoTarefa: taskFormData[id].cd_TipoTarefa,
            idColaborador: CodigoColaborador
            
        }
        try{
            const response = await axios.post("http://localhost:5000/post_card?form=task", taskData)
            console.log("Tarefa adicionada com sucesso!", response.data)
            set_ModalOpen(true)
            set_FormStatusMessage("Tarefa adicionada com sucesso!")
            set_formStatusErrorMessage("")

            set_taskFormData(prev => ({
                ...prev,
                [taskData.idIntimacao]: {
                    ...prev[taskData.idIntimacao],
                    nm_StatusTarefa: '',
                    dt_Prazo: '',
                    ds_Tarefa: '',
                    cd_TipoTarefa: '',
                }
            }))
            set_selectTypeTask("")

            CatchIntInfo()

        }catch(error){
            console.error("Erro ao adicionar Tarefa:", error)
            set_ModalOpen(true)
            set_FormStatusMessage("Erro ao adicionar Tarefa")
            set_formStatusErrorMessage(error.response.data.error)
        } 
    }

    // Buscando Intimações e Tarefas (Tentei separar as funções, porém causava erros no servidor)
    const CatchIntInfo = async () => {
        try{
            const response = await axios.get("http://localhost:5000/get_cardInt", {params: { parte: nm_Cliente, numeroProcesso: cd_NumeroProcesso }})
            set_Intimacoes(response.data)
            console.log(response.data)
        }catch(error){
            console.error("Erro ao buscar intimações:", error)
        }

        try{
            const response = await axios.get("http://localhost:5000/get_cardTask", {params: { parte: nm_Cliente, numeroProcesso: cd_NumeroProcesso }})
            set_Tarefas(response.data)
            console.log(response.data)
        }catch(error){
            console.log("Erro ao buscar Tarefas:", error)
        }
    }

    // const CatchTaskInfo = async () => {
        
    // }

    // Toda vez que abrir o card, a intimação do processo linkado é buscada (DEPRECATED)
    // useEffect(() =>{
    //     if(openCardId !== null){CatchCardInfo()}
    // }, [openCardId])

    // Resolve o erro do buraco ao sair de uma página para outra.
    useEffect(() =>{
        window.scrollTo({
            top: 1,
            behavior: "instant"
        })
    }, [])

    // Recupera os dados após uma edição e, caso não houver processos, reseta o estado do formulario
    useEffect(() => {
        if(editProcess){
            (async () => {
                try{
                    const response = await axios.get("http://localhost:5000/get_processos", {
                        params: { id_processo: cd_NumeroProcesso, parte: nm_Cliente }
                    })
                    set_Processos(response.data)
                    if(response.data.length === 0){
                        set_foundProcess(false)
                        set_CloseForm(true)
                    }
                } catch (error) {
                    console.log("Erro ao atualizar o processo: ", error)
                }
            })()
        }
        set_editProcess(false)
    }, [editProcess])

    // Para deletar um processo
    useEffect(() => {
        if(deleteConfirm){
            (async () => {
                try{
                    const response = await axios.delete("http://localhost:5000/delete_processo", { 
                        data: { deleteProcess },
                        headers: { "Content-Type": "application/json" }
                    })
                    console.log(response)
                    set_deleteDialog(false)
                    set_formStatusErrorMessage("")
                    set_FormStatusMessage("Processo deletado com sucesso!")
                    
                    // Buscando a lista atualizada no banco
                    try{
                        const response = await axios.get("http://localhost:5000/get_processos", {
                            params: { id_processo: cd_NumeroProcesso, parte: nm_Cliente }
                        })

                        set_Processos(response.data)
                    } catch (error){
                        console.log("Erro em atualizar processos após uma exclusão:", error)
                    }
                } catch (error){
                    set_deleteDialog(false)
                    set_FormStatusMessage("Erro ao deletar processo")
                    set_formStatusErrorMessage(error.response.data.error)

                }
            })()
        }
        set_deleteConfirm(false)
    }, [deleteConfirm])

    // Para editar um card de tarefa
    const handleUpdateTaskSubmit = async (e, cdTarefa) =>{
        e.preventDefault()
        set_Loading(true)
        console.log(edit_dtPrazo, edit_cdStatus, edit_dsTarefa, cdTarefa)

        const updateTask = {
                dtPrazo: edit_dtPrazo,
                cdStatus: edit_cdStatus,
                dsTarefa: edit_dsTarefa,
                cdTarefa: cdTarefa
            }

        try{
            const response = await axios.put("http://localhost:5000/put_cardTask", updateTask)
            console.log(response)
            set_ModalOpen(true)
            set_FormStatusMessage("Tarefa editada com sucesso!")
            set_formStatusErrorMessage("")
            set_editTaskSvg(null)
            CatchIntInfo()

        }catch (error){
            console.log("Erro ao editar tarefa:", error)
            set_ModalOpen(true)
            set_FormStatusMessage("Erro ao editar tarefa.")
            set_formStatusErrorMessage(error.response.data.error)
        }
        set_Loading(false)
    }

    // Para o formulário de edição de uma tarefa (campo selectPrimary)
    useEffect(() => {
        const taskToGroupMap = {
            // Grupo 1: Petições e Atos processuais
            1: "1", 2: "1", 3: "1", 4: "1", 5: "1", 6: "1", 7: "1",
            // Grupo 2: Provas
            8: "2", 9: "2",
            // Grupo 3: Custas e cálculos
            10: "3", 11: "3", 12: "3", 13: "3",
            // Grupo 4: Execução
            14: "4",
            // Grupo 5: Comunicação com cliente
            15: "5", 16: "5", 17: "5", 18: "5", 19: "5", 20: "5", 21: "5",
            // Grupo 6: Administração
            22: "6", 23: "6",
            // Grupo 7: Recursos
            24: "7", 25: "7", 26: "7", 27: "7", 28: "7", 29: "7", 30: "7", 31: "7",
            32: "7", 33: "7", 34: "7", 35: "7", 36: "7", 37: "7", 38: "7",
            39: "7", 40: "7", 41: "7", 42: "7", 43: "7", 44: "7"
        }

        if (edit_cdTipoTarefa) {
            const grupo = taskToGroupMap[parseInt(edit_cdTipoTarefa)]
            if (grupo) set_edit_PrimarySelect(grupo)
        }
    }, [edit_cdTipoTarefa])


    // Props da tela de adicionar processos
    const ProcessProps = {
        ShowWindow: openAddProcess, 
        setShowWindow: set_openAddProcess,
        ShowEditWindow: OpenEditProcess,
        setShowEditWindow: set_OpenEditProcess,
        editInfo: PropEditProcess,
        setAddedProcess: set_addedProcess,
        setEditedProcess: set_editProcess
    }
    
    // Props do modal
    const clienteModalProps = {
        isOpen: isModalOpen, 
        onClose: () => set_ModalOpen(false),
        message: formStatusMessage, 
        messageError: fromStatusErrorMessage, 
        DeleteConfirmation: deleteDialog, 
        setConfirmation: set_deleteConfirm
    }

    const processoOptions = useMemo(() => cd_ListNumeroProcesso.map(processo => ({
        value: processo.cd_NumeroProcesso, // O valor que seu estado usa
        label: processo.cd_NumeroProcesso  // O que será exibido na tela
    })), [cd_ListNumeroProcesso])

    return(
        <>
            <Processo {...ProcessProps}/>
            {Loading && (<Loading_Form setDOM={true}/>)}
            <Consult_form $cardOpen={CloseForm} $Enviado={foundProcess} $processOpen={openAddProcess} $editOpen={OpenEditProcess} onSubmit={getProcessSubmit}>
                <div className="GroupBy">
                    <div className="input-group">
                        <label className="label" htmlFor="cd_NumeroProcesso">Número do Processo</label>
                        <StyledSelect
                            id="cd_NumeroProcesso"
                            options={processoOptions}
                            value={processoOptions.find(option => option.value === cd_NumeroProcesso) || null}
                            onChange={(selectedOption) => {
                                set_cdNumeroEndereco(selectedOption ? selectedOption.value : "");
                            }}
                            placeholder={ isMobile ? "Processo..." : "Digite o número do processo..."}
                            isClearable
                            // Render the menu in a portal appended to document.body to avoid stacking/context issues
                            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            menuPosition="fixed"
                            // Ensure the portal menu appears above other elements and keep background consistent
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                menu: base => ({ ...base, zIndex: 9999, backgroundColor: '#2c2c2c' }),
                                menuList: base => ({ ...base, backgroundColor: '#2c2c2c', color: '#e0e0e0' }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused ? '#4f4f6a' : 'transparent',
                                    color: '#e0e0e0'
                                }),
                                singleValue: base => ({ ...base, color: '#e0e0e0' }),
                                input: base => ({ ...base, color: '#e0e0e0' }),
                                placeholder: base => ({ ...base, color: '#888' })
                            }}
                            // Lembre-se destas duas props importantes:
                            classNamePrefix="react-select"
                            $found_data={notFound}
                        />
                    </div>
                    <div className="input-group">
                        <label className="label" htmlFor="nm_Cliente">Nome da parte</label>
                        <InputError onChange={(e) => {
                            const ParsedInteger = e.target.value.replace(/[^a-zA-ZÀ-ÿ]\s/g, "")
                            set_nmCliente(ParsedInteger)}}
                            autoComplete="off" name="nm_Cliente" id="nm_Cliente" className="input" type="text" value={nm_Cliente}
                            $found_data={notFound} />
                    </div>
                    {notFound && (<NotFound_Error>Nenhum processo encontrado.</NotFound_Error>)}
                </div>
                <Twin_Button $disableForProcess={processos.length > 0 && !notFound && foundProcess}>
                    <Consult_button className="form-button" type="submit">
                        {!foundProcess ? (<>Pesquisar</>) : (<>Voltar</>)}
                        </Consult_button>
                    <Consult_button className="add-processo-button" type="button" onClick={() => set_openAddProcess(prev => !prev)} style={{ padding: "0 33px" }}>Adicionar Processo</Consult_button>
                </Twin_Button>
            </Consult_form>
            {processos.length > 0 && (
                <Process_Cards $cardOpen={CloseForm} $processOpen={openAddProcess} $editOpen={OpenEditProcess}>
                    {processos.map((processo) => {
                        const isOpen = openCardId === processo.cd_Processo
                        const formatedPhone = processo.cd_Telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
                        const formatedMoney = processo.vl_Causa.replace(".", ",")

                        return (
                            <div key={processo.cd_Processo} className="OneCard">
                                <hr />
                                <Card_Title $cardOpen={isOpen} onClick={() => {
                                    set_OpenCardId(isOpen ? null : processo.cd_Processo)
                                    if(openCardId === null){
                                        set_openFormIdTask(null)
                                        set_openTaskId(null)
                                        set_editTaskSvg(null)
                                    }
                                    set_CloseForm(isOpen ? true : false) // Verifica se o card está aberto e fecha a consulta
                                    }}>Processo Nº {processo.cd_NumeroProcesso}
                                    {/* Caso o colaborador for estágiario, não pode editar nem excluir os processos */}
                                    {TipoColaborador != "Estagiário" && (
                                        <>
                                            <PencilSquareIcon onClick={(e) => {
                                                e.stopPropagation()
                                                set_OpenEditProcess(true)
                                                set_PropEditProcess({
                                                    cdNumeroProcesso: processo.cd_NumeroProcesso,
                                                    cdProcesso: processo.cd_Processo,
                                                    dsAcao: processo.ds_Acao,
                                                    dsJuizo: processo.ds_Juizo,
                                                    nmAutor: processo.nm_Autor,
                                                    nmCidade: processo.nm_Cidade,
                                                    nmCliente: processo.nm_Cliente,
                                                    cdCliente: processo.cd_Cliente,
                                                    nmReu: processo.nm_Reu,
                                                    sgTribunal: processo.sg_Tribunal,
                                                    vlCausa: processo.vl_Causa.replace("." , ","),
                                                    cdFaseProcesso: processo.cd_FaseProcesso 
                                                })
                                            }}/>
                                            <svg onClick={(e) => {
                                                e.stopPropagation()
                                                set_ModalOpen(true)
                                                set_deleteDialog(true)
                                                set_FormStatusMessage("Processo " + processo.cd_NumeroProcesso)
                                                set_DeleteProcess(processo.cd_Processo)
                                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13.5H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                            </svg>
                                        </>
                                    )}
                                </Card_Title>

                                <Card $cardOpen={isOpen}>
                                    <First_info $buttonOpen={OpenAddInt}>
                                        <div className="Core-data">
                                            <div className="Client-info">
                                                <h2>Dados do Cliente</h2>
                                                <hr />
                                                <p><strong>Nome: </strong>{processo.nm_Cliente}</p>
                                                <p><strong>Telefone: </strong>{formatedPhone}</p>
                                                <p><strong>E-mail: </strong>{processo.ds_Email}</p>
                                                <hr />
                                                <h2>DADOS DO PROCESSO</h2>
                                                <p><strong>Situação: </strong>{processo.cd_FaseProcesso === 1 ? "Conhecimento" : 
                                                    processo.cd_FaseProcesso === 2 ? "Recursal" :
                                                    processo.cd_FaseProcesso === 3 ? "Execução" : 
                                                    processo.cd_FaseProcesso === 4 ? "Finalizado" : "Cancelado"}</p>
                                                <p><strong style={{ color: "#CDAF6F"}}>Autor: </strong>{processo.nm_Autor}</p>
                                                <p><strong style={{ color: "#fc0328" }}>Réu: </strong>{processo.nm_Reu}</p>
                                                <p><strong>Juizo: </strong>{processo.sg_Tribunal}</p>
                                                <p><strong>Descrição: </strong>{processo.ds_Juizo}</p>
                                                <p><strong>Cidade: </strong>{processo.nm_Cidade}</p>
                                                <p><strong>Valor da causa:</strong> R${formatedMoney}</p>
                                                <br />
                                                <div className="DsAcao">
                                                    <h4 style={{ margin: "0 0 5px 0" }}><strong>Descrição da ação</strong></h4>
                                                    <p style={{ margin: "0", textAlign: "center" }}>{processo.ds_Acao}</p>
                                                </div>
                                            </div>
                                            <Consult_button onClick={() => set_OpenAddInt(prev => !prev)}>Adicionar intimação</Consult_button>
                                        </div>
                                        
                                        <Consult_IntForm className="formInt" $buttonOpen={OpenAddInt} onSubmit={(e) => PostIntimaçãoSubmit(e, processo.cd_Processo)}>
                                            <h2>Adicionar Intimação</h2>
                                            <hr />
                                            <div className="input-group">
                                                <label className="label" htmlFor="ds_Intimacao">Descrição</label>
                                                <textarea onChange={(e) => handleCardChange(processo.cd_Processo, 'ds_Intimacao', e.target.value)}
                                                value={formData[processo.cd_Processo]?.ds_Intimacao || '' /*Isso evita que o valor seja undefined ou null, previnindo erros*/}
                                                autoComplete="off" name="ds_Intimacao" id="ds_Intimacao" className="input" type="text" required/>
                                            </div>
                                            <Consult_button>Enviar</Consult_button>
                                        </Consult_IntForm>
                                        
                                    </First_info>
                                    {Intimacoes.length > 0 && (
                                        <Intimacao_card>
                                            <hr />
                                            {Intimacoes.map((intimacao) => {
                                                
                                                //ERRO: 20/02... VEM COMO 19/02 (DUE TO TIME ZONE DIFERENCES)
                                                function formatDateWithoutTimezone(dateStr, hour, dateUS) {
                                                    const date = new Date(dateStr)
                                                    const dia = String(date.getUTCDate()).padStart(2, '0')
                                                    const mes = String(date.getUTCMonth() + 1).padStart(2, '0')
                                                    const ano = date.getUTCFullYear()
                                                    if(hour === true){
                                                        const hora = String(date.getUTCHours()).padStart(2, '0')
                                                        const minuto = String(date.getUTCMinutes()).padStart(2, '0')
                                                        const segundo = String(date.getUTCSeconds()).padStart(2, '0')
                                                        return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`
                                                    }
                                                    if(dateUS){
                                                        return `${ano}-${mes}-${dia}`
                                                    }
                                                    return `${dia}/${mes}/${ano}`
                                                }
                                                //ERRO: 20/02... VEM COMO 19/02 (DUE TO TIME ZONE DIFERENCES)
                                                const formatted = formatDateWithoutTimezone(intimacao.dt_Recebimento, true, false)

                                                if(processo.cd_Processo === intimacao.cd_Processo){
                                                    const formTaskisOpen = openFormIdTask === intimacao.cd_Intimacao
                                                    const typeTaskOpen = selectTypeTask !== ""
                                                    return(
                                                        <div className="Intimacao-group" key={intimacao.cd_Intimacao}>
                                                            <h2>Dados da Intimação {intimacao.cd_Intimacao}</h2>
                                                            <p><strong>Data do recebimento: </strong>{formatted}</p>
                                                            <p><strong>Descrição: </strong>{intimacao.ds_Intimacao}</p>
                                                            <div className="addTask">
                                                                <Consult_button $buttonTaskOpen={formTaskisOpen} onClick={() => {set_openFormIdTask(formTaskisOpen ? null : intimacao.cd_Intimacao)}} style={{ display: "flex", flexDirection: "row", padding: "0", alignItems: "center", justifyContent: "center", gap: "8px"}}>
                                                                    Adicionar tarefa
                                                                    <PlusIcon style={{ width: "25px" }} />
                                                                </Consult_button>
                                                                <Consult_TaskForm $addTaskOpen={formTaskisOpen} $openTypeTask={typeTaskOpen} onSubmit={(e) => PostTaskSubmit(e, intimacao.cd_Intimacao)}>
                                                                    <h2>Adicionar Tarefa</h2>
                                                                    <hr />
                                                                    <div className="input-group">
                                                                        <label className="label" htmlFor="dt_Prazo">Prazo</label>
                                                                        <input onChange={(e) => {handleTaskChange(intimacao.cd_Intimacao, 'dt_Prazo', e.target.value)}}
                                                                        value={taskFormData[intimacao.cd_Intimacao]?.dt_Prazo || ''} autoComplete="off"
                                                                        name="dt_Prazo" id="dt_Prazo" className="input" type="date" required/>
                                                                    </div>
                                                                    <div className="input-group-select">
                                                                        <label className="label" htmlFor="nm_StatusTarefa">Status da tarefa</label>
                                                                        <select onChange={(e) => handleTaskChange(intimacao.cd_Intimacao, 'nm_StatusTarefa', e.target.value)}
                                                                        value={taskFormData[intimacao.cd_Intimacao]?.nm_StatusTarefa || ''} name="nm_StatusTarefa" id="nm_StatusTarefa" className="input-select" required>
                                                                            <option value="">Selecione</option>
                                                                            <option value="1">Aguardando</option>
                                                                            <option value="2">Em andamento</option>
                                                                            <option value="3">Concluído</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="input-group-select">
                                                                        <label style={{ width: "200px"}} className="label" htmlFor="nm_TipoPrimary">Tipo primário da tarefa</label>
                                                                        <select onChange={(e) => set_selectTypeTask(e.target.value)} value={selectTypeTask}
                                                                        name="nm_TipoPrimary" id="nm_TipoPrimary" className="input-select" required>
                                                                            <option value="">Selecione</option>
                                                                            <option value="1">Petições e Atos processuais</option>
                                                                            <option value="2">Provas</option>
                                                                            <option value="3">Custas e cálculos</option>
                                                                            <option value="4">Execução</option>
                                                                            <option value="5">Comunicação com cliente</option>
                                                                            <option value="6">Administração</option>
                                                                            <option value="7">Recursos</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="input-group-select-primary">
                                                                        <label className="label" htmlFor="cd_TipoTarefa">Tipo da tarefa</label>
                                                                        <select onChange={(e) => handleTaskChange(intimacao.cd_Intimacao, 'cd_TipoTarefa', e.target.value)}
                                                                        value={taskFormData[intimacao.cd_Intimacao]?.cd_TipoTarefa || ''} name="cd_TipoTarefa" id="cd_TipoTarefa" className="input-select" required>
                                                                            {selectTypeTask === "1" ? 
                                                                            (<>
                                                                                <option value="">Selecione</option>
                                                                                <option value="1">Despachar com Juízo</option>
                                                                                <option value="2">Diligência externa</option>
                                                                                <option value="3">Incidente de Desconsideração PJ</option>
                                                                                <option value="4">Pedido de habilitação</option>
                                                                                <option value="5">Petição Diversa</option>
                                                                                <option value="6">Petição Inicial</option>
                                                                                <option value="7">Protocolar petição</option>
                                                                            </>) : selectTypeTask === "2" ? 
                                                                            (<>
                                                                                <option value="">Selecione</option>
                                                                                <option value="8">Arrolar Testemunhas</option>
                                                                                <option value="9">Especificação de provas</option>
                                                                            </>) : selectTypeTask === "3" ?
                                                                            (<>
                                                                                <option value="">Selecione</option>
                                                                                <option value="10">Comprovar pagamento</option>
                                                                                <option value="11">Comprovar recolhimento de custas</option>
                                                                                <option value="12">Elaborar cálculo</option>
                                                                                <option value="13">Recolher custas</option>
                                                                            </>) : selectTypeTask === "4" ?
                                                                            (<>
                                                                                <option value="">Selecione</option>
                                                                                <option value="14">Cumprimento de Sentença</option>
                                                                            </>) : selectTypeTask === "5" ?
                                                                            (<>
                                                                                <option value="">Selecione</option>
                                                                                <option value="15">Agendar reunião com cliente</option>
                                                                                <option value="16">Reporte ao cliente</option>
                                                                                <option value="17">Solicitar cumprimeto de obrigação (cliente)</option>
                                                                                <option value="18">Solicitar documento (cliente)</option>
                                                                                <option value="19">Solicitar informações (cliente)</option>
                                                                                <option value="20">Solicitar pagamento (cliente)</option>
                                                                                <option value="21">Comprovar cumprimento de obrigação</option>
                                                                            </>) : selectTypeTask === "6" ?
                                                                            (<>
                                                                                <option value="">Selecione</option>
                                                                                <option value="22">Organização de documentos</option>
                                                                                <option value="23">Análise de intimação</option>
                                                                            </>) : 
                                                                            (<>
                                                                                <option value="">Selecione</option>
                                                                                <option value="24">Agravo de Instrumento</option>
                                                                                <option value="25">Agravo em Execução Penal</option>
                                                                                <option value="26">Agravo em Recurso Especial/Extraordinário</option>
                                                                                <option value="27">Agravo Interno</option>
                                                                                <option value="28">Agravo Regimental</option>
                                                                                <option value="29">Agravo Regimental/Interno</option>
                                                                                <option value="30">Agravo de Petição</option>
                                                                                <option value="31">Apelação</option>
                                                                                <option value="32">de Revista</option>
                                                                                <option value="33">Embargos à Execução</option>
                                                                                <option value="34">Embargos à Execução Fiscal</option>
                                                                                <option value="35">Embargos de Declaração</option>
                                                                                <option value="36">Embargos de Divergência</option>
                                                                                <option value="37">Embargos Infrigentes</option>
                                                                                <option value="38">Especial</option>
                                                                                <option value="39">Extraordinário</option>
                                                                                <option value="40">Habeas Corpus</option>
                                                                                <option value="41">Mandado de Segurança</option>
                                                                                <option value="42">Ordinário</option>
                                                                                <option value="43">em Sentido Estrito</option>
                                                                                <option value="44">Outros</option>
                                                                            </>)}
                                                                        </select>
                                                                    </div>
                                                                    <div className="input-group">
                                                                        <label className="label" htmlFor="ds_Tarefa">Descrição da Tarefa</label>
                                                                        <textarea onChange={(e) => handleTaskChange(intimacao.cd_Intimacao, 'ds_Tarefa', e.target.value)}
                                                                        value={taskFormData[intimacao.cd_Intimacao]?.ds_Tarefa || '' /*Isso evita que o valor seja undefined ou null, previnindo erros*/}
                                                                        autoComplete="off" name="ds_Tarefa" id="ds_Tarefa" className="input" type="text" maxLength={200} required/>
                                                                    </div>
                                                                    <Consult_button>Enviar</Consult_button>
                                                                </Consult_TaskForm>
                                                            </div>
                                                            
                                                            {Tarefas.length > 0 &&(
                                                                <div>
                                                                    {Tarefas.map((task) => {  
                                                                        const formatedRecebimento = formatDateWithoutTimezone(task.dt_Registro, true, false)
                                                                        const formatedPrazo = formatDateWithoutTimezone(task.dt_Prazo, false, false)
                                                                        
                                                                        const statusStyle = {
                                                                            1: { color: "yellow" },
                                                                            2: { color: "orange" },
                                                                            3: { color: "green" },
                                                                            4: { color: "red" },
                                                                        }

                                                                        if(task.cd_Intimacao === intimacao.cd_Intimacao){

                                                                            // Para abrir cada tarefa
                                                                            const taskOpen = openTaskId === task.cd_Tarefa
                                                                            // Para abrir o formulario de edição de cada tarefa
                                                                            const editTaskOpen = editTaskSvg === task.cd_Tarefa

                                                                            return(
                                                                                <div key={task.cd_Tarefa}>
                                                                                    <Task_card $taskIdOpen={taskOpen}>
                                                                                        <div className="Task-Title" onClick={() => set_openTaskId(taskOpen ? null : task.cd_Tarefa)}>
                                                                                            <h4>{task.nm_TipoTarefa}</h4>
                                                                                            <p style={statusStyle[task.cd_StatusTarefa]}><strong>{task.cd_StatusTarefa === 1 ? "Aguardando" :
                                                                                                task.cd_StatusTarefa === 2 ? "Em andamento" : 
                                                                                                task.cd_StatusTarefa === 3 ? "Concluído" : "Cancelado"}</strong>
                                                                                            </p>
                                                                                            {/* Os estagiários podem apenas editar tarefas que eles mesmos criaram */}
                                                                                            {(TipoColaborador !== "Estagiário" || task.nm_Colaborador === NomeColaborador) && (
                                                                                            <svg onClick={(e) => {
                                                                                                e.stopPropagation()
                                                                                                set_editTaskSvg(editTaskOpen ? null : task.cd_Tarefa)
                                                                                                set_edit_dtPrazo(formatDateWithoutTimezone(task.dt_Prazo, false, true))
                                                                                                set_edit_cdStatus(task.cd_StatusTarefa)
                                                                                                set_edit_dsTarefa(task.ds_Tarefa)
                                                                                                set_edit_cdTipoTarefa(task.cd_TipoTarefa)
                                                                                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                                            </svg>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="task-group">
                                                                                            <hr />
                                                                                            <p><strong>Adicionada por: </strong>{task.nm_Colaborador}</p>
                                                                                            <p><strong>Incluida: </strong>{formatedRecebimento}</p>
                                                                                            <p><strong>Prazo: </strong>{formatedPrazo}</p>
                                                                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px"}}>
                                                                                                <strong>Descrição</strong>
                                                                                                <p>{task.ds_Tarefa}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Task_card>
                                                                                    <Edit_taskForm $EditOpen={editTaskOpen} onSubmit={(e) => handleUpdateTaskSubmit(e, task.cd_Tarefa)}>
                                                                                        <h2>Editar Tarefa</h2>
                                                                                        <hr />
                                                                                        <div className="input-group">
                                                                                            <label className="label" htmlFor="dt_Prazo">Prazo</label>
                                                                                            <input onChange={(e) => set_edit_dtPrazo(e.target.value)}
                                                                                            autoComplete="off" value={edit_dtPrazo}
                                                                                            name="dt_Prazo" id="dt_Prazo" className="input" type="date" required/>
                                                                                        </div>
                                                                                        <div className="input-group-select">
                                                                                            <label className="label" htmlFor="nm_StatusTarefa">Status da tarefa</label>
                                                                                            <select onChange={(e) => set_edit_cdStatus(e.target.value)} value={edit_cdStatus}
                                                                                            id="nm_StatusTarefa" className="input-select" required>
                                                                                                <option value="">Selecione</option>
                                                                                                <option value="1">Aguardando</option>
                                                                                                <option value="2">Em andamento</option>
                                                                                                <option value="3">Concluído</option>
                                                                                                <option value="4">Cancelado</option>
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className="input-group-select">
                                                                                            <label style={{ width: "auto" }} className="label" htmlFor="nm_StatusTarefa">Tipo primário da tarefa</label>
                                                                                            <select onChange={(e) => set_edit_PrimarySelect(e.target.value)} value={edit_PrimarySelect}
                                                                                            id="nm_StatusTarefa" className="input-select" required>
                                                                                                <option value="">Selecione</option>
                                                                                                <option value="1">Petições e Atos processuais</option>
                                                                                                <option value="2">Provas</option>
                                                                                                <option value="3">Custas e cálculos</option>
                                                                                                <option value="4">Execução</option>
                                                                                                <option value="5">Comunicação com cliente</option>
                                                                                                <option value="6">Administração</option>
                                                                                                <option value="7">Recursos</option>
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className="input-group-select-primary">
                                                                                            <label className="label" htmlFor="cd_TipoTarefa">Tipo da tarefa</label>
                                                                                            <select onChange={(e) => set_edit_cdTipoTarefa(e.target.value)}
                                                                                            value={edit_cdTipoTarefa} name="cd_TipoTarefa" id="cd_TipoTarefa" className="input-select" required>
                                                                                                {edit_PrimarySelect === "1" ? 
                                                                                                (<>
                                                                                                    <option value="">Selecione</option>
                                                                                                    <option value="1">Despachar com Juízo</option>
                                                                                                    <option value="2">Diligência externa</option>
                                                                                                    <option value="3">Incidente de Desconsideração PJ</option>
                                                                                                    <option value="4">Pedido de habilitação</option>
                                                                                                    <option value="5">Petição Diversa</option>
                                                                                                    <option value="6">Petição Inicial</option>
                                                                                                    <option value="7">Protocolar petição</option>
                                                                                                </>) : edit_PrimarySelect === "2" ? 
                                                                                                (<>
                                                                                                    <option value="">Selecione</option>
                                                                                                    <option value="8">Arrolar Testemunhas</option>
                                                                                                    <option value="9">Especificação de provas</option>
                                                                                                </>) : edit_PrimarySelect === "3" ?
                                                                                                (<>
                                                                                                    <option value="">Selecione</option>
                                                                                                    <option value="10">Comprovar pagamento</option>
                                                                                                    <option value="11">Comprovar recolhimento de custas</option>
                                                                                                    <option value="12">Elaborar cálculo</option>
                                                                                                    <option value="13">Recolher custas</option>
                                                                                                </>) : edit_PrimarySelect === "4" ?
                                                                                                (<>
                                                                                                    <option value="">Selecione</option>
                                                                                                    <option value="14">Cumprimento de Sentença</option>
                                                                                                </>) : edit_PrimarySelect === "5" ?
                                                                                                (<>
                                                                                                    <option value="">Selecione</option>
                                                                                                    <option value="15">Agendar reunião com cliente</option>
                                                                                                    <option value="16">Reporte ao cliente</option>
                                                                                                    <option value="17">Solicitar cumprimeto de obrigação (cliente)</option>
                                                                                                    <option value="18">Solicitar documento (cliente)</option>
                                                                                                    <option value="19">Solicitar informações (cliente)</option>
                                                                                                    <option value="20">Solicitar pagamento (cliente)</option>
                                                                                                    <option value="21">Comprovar cumprimento de obrigação</option>
                                                                                                </>) : edit_PrimarySelect === "6" ?
                                                                                                (<>
                                                                                                    <option value="">Selecione</option>
                                                                                                    <option value="22">Organização de documentos</option>
                                                                                                    <option value="23">Análise de intimação</option>
                                                                                                </>) : 
                                                                                                (<>
                                                                                                    <option value="">Selecione</option>
                                                                                                    <option value="24">Agravo de Instrumento</option>
                                                                                                    <option value="25">Agravo em Execução Penal</option>
                                                                                                    <option value="26">Agravo em Recurso Especial/Extraordinário</option>
                                                                                                    <option value="27">Agravo Interno</option>
                                                                                                    <option value="28">Agravo Regimental</option>
                                                                                                    <option value="29">Agravo Regimental/Interno</option>
                                                                                                    <option value="30">Agravo de Petição</option>
                                                                                                    <option value="31">Apelação</option>
                                                                                                    <option value="32">de Revista</option>
                                                                                                    <option value="33">Embargos à Execução</option>
                                                                                                    <option value="34">Embargos à Execução Fiscal</option>
                                                                                                    <option value="35">Embargos de Declaração</option>
                                                                                                    <option value="36">Embargos de Divergência</option>
                                                                                                    <option value="37">Embargos Infrigentes</option>
                                                                                                    <option value="38">Especial</option>
                                                                                                    <option value="39">Extraordinário</option>
                                                                                                    <option value="40">Habeas Corpus</option>
                                                                                                    <option value="41">Mandado de Segurança</option>
                                                                                                    <option value="42">Ordinário</option>
                                                                                                    <option value="43">em Sentido Estrito</option>
                                                                                                    <option value="44">Outros</option>
                                                                                                </>)}
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className="input-group">
                                                                                            <label className="label" htmlFor="ds_Tarefa">Descrição da Tarefa</label>
                                                                                            <textarea onChange={(e) => set_edit_dsTarefa(e.target.value)} autoComplete="off" name="ds_Tarefa" id="ds_Tarefa" 
                                                                                            className="input" type="text" maxLength={200} value={edit_dsTarefa} required/>
                                                                                        </div>
                                                                                        <Consult_button>Enviar</Consult_button>
                                                                                    </Edit_taskForm>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })}
                                                                </div>
                                                            )}
                                                            <hr />
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </Intimacao_card>

                                    )}
                                </Card>
                            </div>
                        )
                    })}
                </Process_Cards>
            )}
            <Modal {...clienteModalProps}/>
        </>
    )
}

