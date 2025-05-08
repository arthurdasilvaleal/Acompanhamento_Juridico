import { useState, useEffect } from "react"
import { Consult_form, Consult_button, NotFound_Error, InputError, Process_Cards, Card, Card_Title, First_info, Consult_cardForm } from "./style"
import axios from "axios"


export default function Consulta(){

    // Dados dos Processos
    const [cd_NumeroProcesso, set_cdNumeroEndereco] = useState("")
    const [cd_ListNumeroProcesso, set_cdListNumeroProcesso] = useState([])
    const [nm_Cliente, set_nmCliente] = useState("Carlos Silva")
    const [processos, set_Processos] = useState([])

    // Váriáveis de Estado
    const [foundProcess, set_foundProcess] = useState(false)
    const [notFound, set_NotFound] = useState(false)
    const [openCardId, set_OpenCardId] = useState(null)
    const [CloseForm, set_CloseForm] = useState(true)
    const [OpenButtons, set_OpenButtons] = useState(true)

    // Formulário post_Intimação
    const [dt_Recebimento, set_dtRecebimento] = useState(() => {return new Date().toISOString().split("T")[0]})
    const [ds_Intimacao, set_dsIntimacao] = useState("")
    const [dt_Prazo, set_dtPrazo] = useState(() => {return new Date().toISOString().split("T")[0]})
    const [nm_StatusTarefa, set_nmStatusTarefa] = useState("")

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


    // Enviando o form
    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await axios.get("http://192.168.100.3:5000/get_processos", {
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
        
        document.body.style.overflow = "hidden"

        const timeout = setTimeout(() =>{
            document.body.style.overflow = ""
        }, 1000)

        return () => clearTimeout(timeout) // Por segurança, para evitar bugs
        
    }, [CloseForm, foundProcess])

    return(
        <>
            <Consult_form $cardOpen={CloseForm} $Enviado={foundProcess} onSubmit={handleSubmit}>
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
                    return (
                        <div key={processo.cd_Processo} className="OneCard">
                            <hr />
                            <Card_Title $cardOpen={isOpen} onClick={() => {
                                set_OpenCardId(isOpen ? null : processo.cd_Processo)
                                set_CloseForm(isOpen ? true : false) // Verifica se o card está aberto e fecha a consulta
                                }}>Processo Nº {processo.cd_NumeroProcesso}
                            </Card_Title>

                            <Card $cardOpen={isOpen}>
                                <First_info>
                                    <div className="Primary-data">
                                        <div className="Client-info">
                                            <h2>Dados do Cliente</h2>
                                            <hr />
                                            <p><strong>Nome: </strong>{processo.nm_Cliente}</p>
                                            <p><strong>Telefone: </strong>{processo.cd_Telefone}</p>
                                            <p><strong>E-mail: </strong>{processo.ds_Email}</p>
                                        </div>
                                        <Consult_button onClick={() => set_OpenButtons(prev => !prev)}>Adicionar</Consult_button>
                                    </div>
                                    <div className="Forms">
                                        <Consult_cardForm $buttonOpen={OpenButtons}>
                                            <h2>Adicionar Intimação</h2>
                                            <div className="input-group">
                                                <label className="label" htmlFor="dt_Recebimento">Data do Recebimento</label>
                                                <input onChange={(e) => set_dtRecebimento(e.target.value)} autoComplete="off" 
                                                name="dt_Recebimento" id="dt_Recebimento" className="input" type="date" value={dt_Recebimento} />
                                            </div>
                                            <div className="input-group">
                                                <label className="label" htmlFor="ds_Intimacao">Descrição</label>
                                                <input onChange={(e) => {
                                                    const ParsedInteger = e.target.value.replace(/[^a-zA-ZÀ-ÿ.,]\s/g, "")
                                                    set_dsIntimacao(ParsedInteger)}} 
                                                autoComplete="off" name="ds_Intimacao" id="ds_Intimacao" className="input" type="text" value={ds_Intimacao} />
                                            </div>
                                        </Consult_cardForm>
                                        <Consult_cardForm $buttonOpen={OpenButtons}>
                                            <h2>Adicionar Tarefa</h2>
                                            <div className="input-group">
                                                <label className="label" htmlFor="dt_Prazo">Prazo</label>
                                                <input onChange={(e) => set_dtPrazo(e.target.value)} autoComplete="off" 
                                                name="dt_Prazo" id="dt_Prazo" className="input" type="date" value={dt_Prazo} />
                                            </div>
                                            <div className="input-group-select">
                                                <label className="label" htmlFor="nm_StatusTarefa">Tribunal</label>
                                                <select onChange={(e) => set_nmStatusTarefa(e.target.value)} name="nm_StatusTarefa" id="nm_StatusTarefa" className="input-select" value={nm_StatusTarefa} required>
                                                    <option value="">Selecione</option>
                                                    <option value="Aguardando">Aguardando</option>
                                                    <option value="Em andamento">Em andamento</option>
                                                    <option value="Concluído">Concluído</option>
                                                </select>
                                            </div>
                                        </Consult_cardForm>
                                    </div>

                                </First_info>
                            </Card>
                        </div>
                    );
                    })}
                </Process_Cards>
            )}
        </>
    )
}