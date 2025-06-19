import { useState, useEffect } from "react"
import { Consult_form, Consult_button, Twin_Button, NotFound_Error, InputError } from "./style"
import { Process_Cards, Card, Card_Title, First_info, Consult_IntForm, Consult_TaskForm } from "./style"
import { Intimacao_card, Task_card } from "./style"
import Processo from "./Add_Processos/Processo"
import Modal from "../../../../components/Modal/Modal"
import Loading_Form from "../../../../components/Loading_Form/Loading"
import axios from "axios"
import { PlusCircleIcon } from "@heroicons/react/24/outline"


export default function Consulta_Processo({ CodigoColaborador }){

    // Dados dos Processos
    const [cd_NumeroProcesso, set_cdNumeroEndereco] = useState("")
    const [cd_ListNumeroProcesso, set_cdListNumeroProcesso] = useState([])
    const [nm_Cliente, set_nmCliente] = useState("Carlos Silva")
    const [processos, set_Processos] = useState([])
    const [Intimacoes, set_Intimacoes] = useState([])

    // Váriáveis de Estado
    const [foundProcess, set_foundProcess] = useState(false) // Achou processo
    const [notFound, set_NotFound] = useState(false)
    const [openCardId, set_OpenCardId] = useState(null) // Abre o card da intimação
    const [CloseForm, set_CloseForm] = useState(true) // Tampar o formulario
    const [OpenAddInt, set_OpenAddInt] = useState(true)
    const [openAddProcess, set_openAddProcess] = useState(false) // Abrir a janela de adicionar processo
    const [firstContact, set_firstContact] = useState(true)// apenas para mobile (evita aquele buraco de merda)
    const [openFormIdTask, set_openFormIdTask] = useState(null) // Abre o formulário de addTarefa de cada card
    const [Loading, set_Loading] = useState(false)

    // Variáveis do Modal
    const [isModalOpen, set_ModalOpen] = useState(false)
    const [formStatusMessage, set_FormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_fromStatusErrorMessage] = useState("")

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

    // Função que separa cada formulário de tarefa
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
        axios.get("http://192.168.100.3:5000/get_processos?only=id")
          .then(response => {
            set_cdListNumeroProcesso(response.data)
          })
          .catch(error => {
            console.error("Erro ao buscar processos:", error)
          })
    }, [])

    // Pesquisando o processo (por nome e/ou numero)
    const getProcessSubmit = async (e) => {
        e.preventDefault()
        set_firstContact(false)
        set_Loading(true)

        if(foundProcess){
            set_foundProcess(false)
            set_Loading(false)
            document.body.style.overflow = "hidden"
        }else{

            try{
                const response = await axios.get("http://192.168.100.3:5000/get_processos", {
                    params: { id_processo: cd_NumeroProcesso, parte: nm_Cliente }
                })

                if(response.data.length > 0){
                    console.log(response.data)
                    set_Processos(response.data)
                    set_foundProcess(true)
                    set_NotFound(false)
                    CatchIntimacoes()
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
            codigoProcesso: id,
            idColaborador: CodigoColaborador
        }

        try{
            const response = await axios.post("http://192.168.100.3:5000/post_card?form=intimacao", IntimacaoData)
            set_ModalOpen(true)
            set_FormStatusMessage("Intimação adicionada com sucesso!")
            set_fromStatusErrorMessage("")

            set_FormData(prev => ({
                ...prev,
                [IntimacaoData.codigoProcesso]: {
                    ...prev[IntimacaoData.codigoProcesso],
                    ds_Intimacao: ''
                }
            }))

            CatchIntimacoes()
            
        }catch(error){
            console.error("Erro ao adicionar Intimação:", error)
            set_ModalOpen(true)
            set_FormStatusMessage("Erro ao adicionar Intimação")
            set_fromStatusErrorMessage(error.response.data.Erro)
        }
    }

    const PostTaskSubmit = async (e, id) => {
        e.preventDefault()

        console.log(taskFormData[id].dt_Prazo + "\n" + taskFormData[id].nm_StatusTarefa + "\n" + taskFormData[id].ds_Tarefa + "\n" + getTodayDate() + "\n" + "Colaborador: " + CodigoColaborador)
        

        const taskData ={
            idIntimacao: id,
            dataPrazo: taskFormData[id].dt_Prazo,
            StatusTarefa: taskFormData[id].nm_StatusTarefa,
            DescricaoTarefa: taskFormData[id].ds_Tarefa,
            DataRecebimento: getTodayDate(),
            idColaborador: CodigoColaborador
            
        }
        try{
            const response = await axios.post("http://192.168.100.3:5000/post_card?form=task", taskData)
            console.log("Tarefa adicionada com sucesso!", response.data)
            set_ModalOpen(true)
            set_FormStatusMessage("Tarefa adicionada com sucesso!")
            set_fromStatusErrorMessage("")

            set_taskFormData(prev => ({
                ...prev,
                [taskData.idIntimacao]: {
                    ...prev[taskData.idIntimacao],
                    nm_StatusTarefa: '',
                    dt_Prazo: '',
                    ds_Tarefa: ''
                }
            }))

        }catch(error){
            console.error("Erro ao adicionar Tarefa:", error)
            set_ModalOpen(true)
            set_FormStatusMessage("Erro ao adicionar Tarefa")
            set_fromStatusErrorMessage(error.response.data.error)
        } 
    }

    // Buscando Intimações
    const CatchIntimacoes = async () => {
        try{
            const response = await axios.get("http://192.168.100.3:5000/get_card", {params: { parte: nm_Cliente, numeroProcesso: cd_NumeroProcesso }})
            set_Intimacoes(response.data)
        }catch(error){
            console.error("Erro ao buscar intimações:", error)
        }
    }

    // Toda vez que abrir o card, a intimação do processo linkado é buscada (DEPRECATED)
    // useEffect(() =>{
    //     if(openCardId !== null){CatchIntimacoes()}
    // }, [openCardId])

    // Resolve o erro do buraco ao sair de uma página para outra.
    useEffect(() =>{
        window.scrollTo({
            top: 1,
            behavior: "instant"
        })
    }, [])
    

    return(
        <>
            <Processo ShowWindow={openAddProcess} setShowWindow={set_openAddProcess}/>
            {Loading && (<Loading_Form />)}
            <Consult_form $cardOpen={CloseForm} $Enviado={foundProcess} $processOpen={openAddProcess} onSubmit={getProcessSubmit}>
                <div className="GroupBy">
                    <div className="input-group">
                        <label className="label" htmlFor="cd_NumeroProcesso">Número do Processo</label>
                        <div>
                            <InputError onChange={(e) => {
                                const ParsedInteger = e.target.value.replace(/[^0-9-.]/g, "")
                                set_cdNumeroEndereco(ParsedInteger)}}
                            autoComplete="off" name="cd_NumeroProcesso" id="cd_NumeroProcesso" className="input" type="text" value={cd_NumeroProcesso} 
                            list="processes-number" $found_data={notFound} />
                        </div>
                        <datalist id="processes-number">
                            {cd_ListNumeroProcesso.map((numero, index) => (
                                <option key={index} value={numero}></option>
                            ))}
                        </datalist> 
                    </div>
                    <div className="input-group">
                        <label className="label" htmlFor="nm_Cliente">Nome da parte</label>
                        <InputError onChange={(e) => {
                            const ParsedInteger = e.target.value.replace(/[^a-zA-ZÀ-ÿ]\s/g, "")
                            set_nmCliente(ParsedInteger)}}
                            autoComplete="off" name="nm_Cliente" id="nm_Cliente" className="input" type="text" value={nm_Cliente}
                            $found_data={notFound} />
                    </div>
                    {notFound && (<NotFound_Error>Processo não encontrado.</NotFound_Error>)}
                </div>
                <Twin_Button $disableForProcess={processos.length > 0 && !notFound && foundProcess}>
                    <Consult_button className="form-button" type="submit">
                        {!foundProcess ? (<>Pesquisar</>) : (<>Voltar</>)}
                        </Consult_button>
                    <Consult_button className="add-processo-button" type="button" onClick={() => set_openAddProcess(prev => !prev)} style={{ padding: "0 33px" }}>Adicionar Processo</Consult_button>
                </Twin_Button>
            </Consult_form>
            {processos.length > 0 && (
                <Process_Cards $cardOpen={CloseForm} $processOpen={openAddProcess}>
                    {processos.map((processo) => {
                        const isOpen = openCardId === processo.cd_Processo
                        const formatedPhone = processo.cd_Telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
                        const formatedMoney = processo.vl_Causa.replace(".", ",")

                        return (
                            <div key={processo.cd_Processo} className="OneCard">
                                <hr />
                                <Card_Title $cardOpen={isOpen} onClick={() => {
                                    set_OpenCardId(isOpen ? null : processo.cd_Processo)
                                    set_CloseForm(isOpen ? true : false) // Verifica se o card está aberto e fecha a consulta
                                    }}>Processo Nº {processo.cd_NumeroProcesso}
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
                                                <p><strong>Autor: </strong>{processo.nm_Autor}</p>
                                                <p><strong>Cidade: </strong>{processo.nm_Cidade}</p>
                                                <p><strong>Valor da causa:</strong> R${formatedMoney}</p>
                                            </div>
                                            <Consult_button onClick={() => set_OpenAddInt(prev => !prev)}>Adicionar</Consult_button>
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
                                                function formatDateWithoutTimezone(dateStr) {
                                                    const date = new Date(dateStr)
                                                    const dia = String(date.getUTCDate()).padStart(2, '0')
                                                    const mes = String(date.getUTCMonth() + 1).padStart(2, '0')
                                                    const ano = date.getUTCFullYear()
                                                    const hora = String(date.getUTCHours()).padStart(2, '0')
                                                    const minuto = String(date.getUTCMinutes()).padStart(2, '0')
                                                    const segundo = String(date.getUTCSeconds()).padStart(2, '0')

                                                    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`
                                                }
                                                //ERRO: 20/02... VEM COMO 19/02 (DUE TO TIME ZONE DIFERENCES)
                                                const formatted = formatDateWithoutTimezone(intimacao.dt_Recebimento)

                                                if(processo.cd_Processo === intimacao.cd_Processo){
                                                    const formTaskisOpen = openFormIdTask === intimacao.cd_Intimacao
                                                    return(
                                                        <div className="Intimacao-group" key={intimacao.cd_Intimacao}>
                                                            <h2>Dados da Intimação {intimacao.cd_Intimacao}</h2>
                                                            <p><strong>Data do recebimento: </strong>{formatted}</p>
                                                            <p><strong>Descrição: </strong>{intimacao.ds_Intimacao}</p>
                                                            <div className="addTask">
                                                                <Consult_button $buttonTaskOpen={formTaskisOpen} onClick={() => {set_openFormIdTask(formTaskisOpen ? null : intimacao.cd_Intimacao)}} style={{ display: "flex", flexDirection: "row", padding: "0", alignItems: "center", justifyContent: "center", gap: "8px"}}>Adicionar tarefa
                                                                    <PlusCircleIcon style={{ width: "25px" }} />
                                                                </Consult_button>
                                                                <Consult_TaskForm $addTaskOpen={formTaskisOpen} onSubmit={(e) => PostTaskSubmit(e, intimacao.cd_Intimacao)}>
                                                                    <h2>Adicionar Tarefa</h2>
                                                                    <hr />
                                                                    <div className="input-group">
                                                                        <label className="label" htmlFor="dt_Prazo">Prazo</label>
                                                                        <input onChange={(e) => {handleTaskChange(intimacao.cd_Intimacao, 'dt_Prazo', e.target.value); console.log(e.target.value)}}
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
                                                                    <div className="input-group">
                                                                        <label className="label" htmlFor="ds_Tarefa">Descrição da Tarefa</label>
                                                                        <textarea onChange={(e) => handleTaskChange(intimacao.cd_Intimacao, 'ds_Tarefa', e.target.value)}
                                                                        value={taskFormData[intimacao.cd_Intimacao]?.ds_Tarefa || '' /*Isso evita que o valor seja undefined ou null, previnindo erros*/}
                                                                        autoComplete="off" name="ds_Tarefa" id="ds_Tarefa" className="input" type="text" maxLength={200} required/>
                                                                    </div>
                                                                    <Consult_button>Enviar</Consult_button>
                                                                </Consult_TaskForm>
                                                            </div>
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
            <Modal isOpen={isModalOpen} onClose={() => set_ModalOpen(false)} message={formStatusMessage} messageError={fromStatusErrorMessage}/>
        </>
    )
}