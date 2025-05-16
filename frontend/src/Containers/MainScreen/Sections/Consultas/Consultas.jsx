import { useState, useEffect } from "react"
import { Consult_form, Consult_button, NotFound_Error, InputError } from "./style"
import { Process_Cards, Card, Card_Title, First_info, Consult_cardForm } from "./style"
import { Intimacao_card } from "./style"
import { InputMask } from "@react-input/mask"
import axios from "axios"


export default function Consulta(){

    // Dados dos Processos
    const [cd_NumeroProcesso, set_cdNumeroEndereco] = useState("")
    const [cd_ListNumeroProcesso, set_cdListNumeroProcesso] = useState([])
    const [nm_Cliente, set_nmCliente] = useState("Carlos Silva")
    const [processos, set_Processos] = useState([])
    const [Intimacoes, set_Intimacoes] = useState([])

    // Váriáveis de Estado
    const [foundProcess, set_foundProcess] = useState(false) // Achou processo
    const [notFound, set_NotFound] = useState(false)
    const [openCardId, set_OpenCardId] = useState(null)
    const [CloseForm, set_CloseForm] = useState(true) // Tampar o formulario
    const [OpenButtons, set_OpenButtons] = useState(true)

    // Variável dos formulários de cada card
    const [formData, setFormData] = useState({})

    // Função para atualizar dados de cada processo
    const handleChange = (processoId, field, value) => {
        setFormData(prev => ({
            ...prev,
            [processoId]: {
                ...prev[processoId],
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
          })
    }, [])


    // Pesquisando o processo (por nome e/ou numero)
    const getProcessSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await axios.get("http://localhost:5000/get_processos", {
                params: { id_processo: cd_NumeroProcesso, parte: nm_Cliente }
            })

            console.log(response.data)
            set_Processos(response.data)
            if(response.data.length > 0){
                set_foundProcess(true)
                set_NotFound(false)
            }
            else{
                set_foundProcess(false)
                set_NotFound(true)
            }
        }catch(error){
            console.error("Erro ao buscar processo:", error)
            set_NotFound(true)
        }
    }

    // Bloqueando a barra de rolagem Y na hora de abrir/fechar o card e achando um processo
    useEffect(() => {
        
        if(foundProcess || !CloseForm){document.body.style.overflow = "hidden"}

        const timeout = setTimeout(() =>{
            document.body.style.overflow = ""
        }, 1000)

        return () => clearTimeout(timeout) // Por segurança, para evitar bugs
        
    }, [CloseForm, foundProcess])

    // Enviando os dados dos formularios dos cards
    const PostIntimaçãoSubmit = async (e, id) => {
        e.preventDefault()
        
        console.log(formData[id].dt_Recebimento + "\n" + formData[id].ds_Intimacao)
        const IntimacaoData = {
            dataRecebimento: formData[id].dt_Recebimento,
            descricaoIntimacao: formData[id].ds_Intimacao,
            codigoProcesso: id
        }

        try{
            const response = await axios.post("http://192.168.100.3:5000/post_card?form=intimacao", IntimacaoData)
            console.log("Intimação adicionada com sucesso!", response.data)
            alert("Intimação adicionada com sucesso!")

            setFormData(prev => ({
                ...prev,
                [IntimacaoData.codigoProcesso]: {
                    ...prev[IntimacaoData.codigoProcesso],
                    dt_Recebimento: '',
                    ds_Intimacao: ''
                }
            }))

            CatchIntimacoes()
        }catch(error){
            console.error("Erro ao adicionar Intimação:", error)
            alert("Erro: " + error.response.data.error)
        }
    }

    const PostTaskSubmit = async (e, id) => {
        e.preventDefault()

        // console.log(formData[id].dt_Prazo + "\n" + formData[id].nm_StatusTarefa)
        // const taskData ={
        //     dataPrazo: formData[id].dt_Prazo,
        //     StatusTarefa: formData[id].nm_StatusTarefa,
            
        // }
        // try{
        //     const response = await axios.post("http://192.168.100.3:5000/post_card?form=task", taskData)
        //     console.log("Tarefa adicionada com sucesso!", response.data)
        //     alert("Tarefa adicionada com sucesso!")

        // }catch(error){
        //     console.error("Erro ao adicionar Tarefa:", error)
        //     alert("Erro: " + error.response.data.error)
        // } 
        // NÃO ESTA PRONTO (CÓDIGO DA INTIMAÇÃO REQUERIDO)
    }

    // Buscando Intimações

    const CatchIntimacoes = () => {
        axios.get("http://localhost:5000/get_card", {params: { id_processo: openCardId}})
            .then(response => {
                set_Intimacoes(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.error("Erro ao buscar intimações:", error)
            })
    }

    useEffect(() =>{
        if(openCardId !== null){CatchIntimacoes()}
    }, [openCardId])

    return(
        <>
            <Consult_form $cardOpen={CloseForm} $Enviado={foundProcess} onSubmit={getProcessSubmit}>
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
                <Consult_button className="form-button" type="submit">Pesquisar</Consult_button>   
            </Consult_form>
            {processos.length > 0 && (
                <Process_Cards $cardOpen={CloseForm}>
                    {processos.map((processo) => {
                        const isOpen = openCardId === processo.cd_Processo
                        const formatedPhone = processo.cd_Telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
                        return (
                            <div key={processo.cd_Processo} className="OneCard">
                                <hr />
                                <Card_Title $cardOpen={isOpen} onClick={() => {
                                    set_OpenCardId(isOpen ? null : processo.cd_Processo)
                                    set_CloseForm(isOpen ? true : false) // Verifica se o card está aberto e fecha a consulta
                                    }}>Processo Nº {processo.cd_NumeroProcesso}
                                </Card_Title>

                                <Card $cardOpen={isOpen}>
                                    <First_info $buttonOpen={OpenButtons}>
                                        <div className="Core-data">
                                            <div className="Client-info">
                                                <h2>Dados do Cliente</h2>
                                                <hr />
                                                <p><strong>Nome: </strong>{processo.nm_Cliente}</p>
                                                <p><strong>Telefone: </strong>{formatedPhone}</p>
                                                <p><strong>E-mail: </strong>{processo.ds_Email}</p>
                                            </div>
                                            <Consult_button onClick={() => set_OpenButtons(prev => !prev)}>Adicionar</Consult_button>
                                        </div>
                                        <div className="Forms">
                                            <Consult_cardForm className="firstForm" $buttonOpen={OpenButtons} onSubmit={(e) => PostIntimaçãoSubmit(e, processo.cd_Processo)}>
                                                <h2>Adicionar Intimação</h2>
                                                <hr />
                                                <div className="input-group">
                                                    <label className="label" htmlFor="dt_Recebimento">Data do Recebimento</label>
                                                    <input onChange={(e) => handleChange(processo.cd_Processo, 'dt_Recebimento', e.target.value)}
                                                    value={formData[processo.cd_Processo]?.dt_Recebimento || ''} autoComplete="off"
                                                    name="dt_Recebimento" id="dt_Recebimento" className="input" type="date" required/>
                                                </div>
                                                <div className="input-group">
                                                    <label className="label" htmlFor="ds_Intimacao">Descrição</label>
                                                    <textarea onChange={(e) => handleChange(processo.cd_Processo, 'ds_Intimacao', e.target.value)}
                                                    value={formData[processo.cd_Processo]?.ds_Intimacao || '' /*Isso evita que o valor seja undefined ou null, previnindo erros*/}
                                                    autoComplete="off" name="ds_Intimacao" id="ds_Intimacao" className="input" type="text" required/>
                                                </div>
                                                <Consult_button>Enviar</Consult_button>
                                            </Consult_cardForm>
                                            <Consult_cardForm $buttonOpen={OpenButtons} onSubmit={(e) => PostTaskSubmit(e, processo.cd_Processo)}>
                                                <h2>Adicionar Tarefa</h2>
                                                <hr />
                                                <div className="input-group">
                                                    <label className="label" htmlFor="dt_Prazo">Prazo</label>
                                                    <input onChange={(e) => handleChange(processo.cd_Processo, 'dt_Prazo', e.target.value)}
                                                    value={formData[processo.cd_Processo]?.dt_Prazo || ''} autoComplete="off"
                                                    name="dt_Prazo" id="dt_Prazo" className="input" type="date" required/>
                                                </div>
                                                <div className="input-group-select">
                                                    <label className="label" htmlFor="nm_StatusTarefa">Status da tarefa</label>
                                                    <select onChange={(e) => handleChange(processo.cd_Processo, 'nm_StatusTarefa', e.target.value)}
                                                    value={formData[processo.cd_Processo]?.nm_StatusTarefa || ''} name="nm_StatusTarefa" id="nm_StatusTarefa" className="input-select" required>
                                                        <option value="">Selecione</option>
                                                        <option value="Aguardando">Aguardando</option>
                                                        <option value="Em andamento">Em andamento</option>
                                                        <option value="Concluído">Concluído</option>
                                                    </select>
                                                </div>
                                                <Consult_button>Enviar</Consult_button>
                                            </Consult_cardForm>
                                        </div>
                                    </First_info>
                                    {Intimacoes.length > 0 && (
                                        <Intimacao_card>
                                            <hr />
                                            {Intimacoes.map((intimacao) => {
                                                
                                                //ERRO: 20/02... VEM COMO 19/02 (DUE TO TIME ZONE DIFERENCES)
                                                function formatDateWithoutTimezone(dateStr) {
                                                    const date = new Date(dateStr);
                                                    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                                                    return localDate.toLocaleDateString("pt-BR");
                                                }
                                                //ERRO: 20/02... VEM COMO 19/02 (DUE TO TIME ZONE DIFERENCES)

                                                const formatted = formatDateWithoutTimezone(intimacao.dt_Recebimento);
                                                return(
                                                    <div className="Intimacao-group" key={intimacao.cd_Intimacao}>
                                                        <h2>Dados da Intimação</h2>
                                                        <p><strong>Data do recebimento: </strong>{formatted}</p>
                                                        <p><strong>Descrição: </strong>{intimacao.ds_Intimacao}</p>
                                                        <hr />
                                                    </div>         
                                                )
                                            })}
                                        </Intimacao_card>
                                    )}
                                    
                                </Card>
                            </div>
                        );
                    })}
                </Process_Cards>
            )}
        </>
    )
}