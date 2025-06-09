import { Process_Form, Process_button, FixedBox, Process_back_button } from "./style"
import { useEffect, useState } from "react"
import { NumericFormat } from 'react-number-format'
import Modal from '../../../../../components/Modal/Modal'
import axios from "axios"

export default function Processos({ ShowWindow, setShowWindow }){
    const [cd_NumProcesso, set_NumProcesso] = useState("")
    const [nm_Cliente, set_nmCliente] = useState("")
    const [ListCliente, set_ListCliente] = useState([])
    const [opcaoCliente, set_OpacaoCliente] = useState("")
    const [nm_Autor, set_Autor] = useState("")
    const [nm_Reu, set_Reu] = useState("")
    const [nm_Cidade, set_Cidade] = useState("")
    const [vl_Causa, set_Causa] = useState("")
    const [ds_Juizo, set_Juizo] = useState("")
    const [ds_Acao, set_Acao] = useState("")
    const [sg_Tribunal, set_Tribunal] = useState("")

    // variáveis de estado
    const isSelectable = nm_Cliente === ""
    const blockCamp = opcaoCliente
    const [isModalOpen, setModalOpen] = useState(false)
    const [ModalStatus, set_ModalStatus] = useState(false)
    const [formStatusMessage, setFormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_fromStatusErrorMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const parsedValueCause = vl_Causa.replace(/[^0-9,]/g, "").replace(",", ".")

        const post_processo = {
            cd_NumProcesso,
            nm_Cliente,
            opcaoCliente,
            nm_Autor,
            nm_Reu,
            nm_Cidade,
            vl_Causa: parsedValueCause,
            ds_Juizo,
            ds_Acao,
            sg_Tribunal
        }
        
        try{
            const response = await axios.post("http://192.168.100.3:5000/post_processo", post_processo)
            console.log("Processo adicionado com sucesso:", response.data)
            setFormStatusMessage("Processo adicionado com sucesso!")
            setModalOpen(true)
            set_ModalStatus(true)

            set_NumProcesso("")
            set_nmCliente("")
            set_OpacaoCliente("")
            set_Autor("")
            set_Reu("")
            set_Cidade("")
            set_Causa("")
            set_Juizo("")
            set_Acao("")
            set_Tribunal("")
            
        } catch (error) {
            console.error("Erro ao adicionar processo:", error)
            setFormStatusMessage("Erro ao Adicionar Processo.")
            set_fromStatusErrorMessage(error.response.data.error)
            setModalOpen(true)
            set_ModalStatus(false)
        }
    }

    // Nesta tela, acrescentar um campo para selecionar o cliente;
    useEffect(() => {
        setTimeout(() => {
            axios.get("http://192.168.100.3:5000/get_clientes")
            .then(response => {
                set_ListCliente(response.data)
            })
            .catch(error => {
                console.error("Erro ao buscar clientes:", error)
            })
          }, 300)
    }, [])

    useEffect(() => {
        if (blockCamp === "1") {
            set_Autor("")
            set_Reu(nm_Cliente)
        } else if (blockCamp === "2") {
            set_Autor(nm_Cliente)
            set_Reu("")
        }
      }, [blockCamp, nm_Cliente])
      

    return(
        <FixedBox $Show={ShowWindow}>
            <Process_back_button onClick={() => {
                    setShowWindow(false)
                    window.scrollTo({
                        top: 20,
                        behavior: "smooth"
                    })
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                </svg>
                <span>Voltar</span>
            </Process_back_button>
            <h1>Adicionar um processo</h1>
            <hr />
            <Process_Form onSubmit={handleSubmit} $clientSelect={isSelectable}>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Processo">Número do Processo</label>
                    <input onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/[^0-9-.]/g, "")
                        set_NumProcesso(ParsedInteger)}} autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" value={cd_NumProcesso} maxLength={25} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Cliente">Nome do Cliente</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_nmCliente(ParsedString)}} list="process-client" autoComplete="off" name="nm_Cliente" id="nm_Cliente" className="input" type="text" value={nm_Cliente} required/>
                    <datalist id="process-client">
                        {ListCliente.map((nome, index) => (
                            <option key={index} value={nome.nm_Cliente}></option>
                        ))}
                    </datalist>
                </div>
                <div className="input-group-select-mid">
                    <label className="label" htmlFor="opcaoCliente">Selecione a posição desse cliente</label>
                    <select onChange={(e) => {
                        set_OpacaoCliente(e.target.value)}} name="opcaoCliente" id="opcaoCliente" className="input-select" value={opcaoCliente} required>
                        <option value="">Selecione</option>
                        <option value="1">Réu</option>
                        <option value="2">Autor</option>
                        <option value="3">Terceiro</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Autor">Nome do Autor</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Autor(ParsedString)}} autoComplete="off" name="nm_Autor" id="nm_Autor" className="input" type="text" value={nm_Autor} disabled={blockCamp === '2'} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Reu">Nome do Réu</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Reu(ParsedString)}} autoComplete="off" name="nm_Reu" id="nm_Reu" className="input" type="text" value={nm_Reu} disabled={blockCamp === '1'} required/>
                </div>
                <div className="input-group">
                <label className="label" htmlFor="nm_Cidade">Cidade</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Cidade(ParsedString)}} autoComplete="off" name="nm_Cidade" id="nm_Cidade" className="input" type="text" value={nm_Cidade} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="vl_Causa">Valor da Causa</label>
                    <NumericFormat thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale prefix="R$ "
                        allowNegative={false} onChange={(e) => set_Causa(e.target.value)} maxLength={16}
                        autoComplete="off" name="vl_Causa" id="vl_Causa" className="input" type="text" value={vl_Causa} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="ds_Juizo">Descrição do Juízo</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ,.0-9°ºª\s]/g, "")
                        set_Juizo(ParsedString)}} autoComplete="off" name="ds_Juizo" id="ds_Juizo" className="input" type="text" value={ds_Juizo} maxLength={30} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="ds_Acao">Descrição da Ação</label>
                    <textarea onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ,.0-9ºª°\s]/g, "")
                        set_Acao(ParsedString)}} autoComplete="off" name="ds_Acao" id="ds_Acao" className="input" type="text" value={ds_Acao} maxLength={50} required/>
                </div>
                <div className="input-group-select">
                    <label className="label" htmlFor="sg_Tribunal">Tribunal</label>
                    <select onChange={(e) => set_Tribunal(e.target.value)} name="sg_Tribunal" id="sg_Tribunal" className="input-select" value={sg_Tribunal} required>
                        <option value="">Selecione</option>
                        <option value="TJSP">TJSP</option>
                        <option value="TRT2">TRT2</option>
                        <option value="TRF3">TRF3</option>
                        <option value="TST">TST</option>
                        <option value="STJ">STJ</option>
                        <option value="STF">STF</option>
                    </select>
                </div>
                <Process_button className='form-button' type="submit">Enviar</Process_button>
            </Process_Form>
            <hr style={{ height: "15px", opacity: "0"}}/>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} message={formStatusMessage} sucess={ModalStatus} messageError={fromStatusErrorMessage}/>
        </FixedBox>
    )
}