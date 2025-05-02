import { Process_Form, Process_button } from "./style"
import { Division_Line } from "../style"
import { useState } from "react"
import { NumericFormat } from 'react-number-format'
import axios from "axios"

export default function Processos(){
    const [cd_NumProcesso, set_NumProcesso] = useState("")
    const [nm_Autor, set_Autor] = useState("")
    const [nm_Reu, set_Reu] = useState("")
    const [nm_Cidade, set_Cidade] = useState("")
    const [vl_Causa, set_Causa] = useState("")
    const [ds_Juizo, set_Juizo] = useState("")
    const [ds_Acao, set_Acao] = useState("")
    const [sg_Tribunal, set_Tribunal] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const parsedValueCause = vl_Causa.replace(/[^0-9,]/g, "").replace(",", ".")

        const post_processo = {
            cd_NumProcesso,
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
            alert("Processo adicionado com sucesso!")

            set_NumProcesso("")
            set_Autor("")
            set_Reu("")
            set_Cidade("")
            set_Causa("")
            set_Juizo("")
            set_Acao("")
            set_Tribunal("")
            
        } catch (error) {
            console.error("Erro ao adicionar processo:", error)
            alert(error.response.data.error)
        }
    }

    return(
        <>
            <h1>Adicionar um processo</h1>
            <hr />
            <Process_Form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Processo">Número do Processo</label>
                    <input onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/\D/g, "")
                        set_NumProcesso(ParsedInteger)}} autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" value={cd_NumProcesso} maxLength={25} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Autor">Nome do Autor</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Autor(ParsedString)}} autoComplete="off" name="nm_Autor" id="nm_Autor" className="input" type="text" value={nm_Autor} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Reu">Nome do Réu</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Reu(ParsedString)}} autoComplete="off" name="nm_Reu" id="nm_Reu" className="input" type="text" value={nm_Reu} required/>
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
                    <textarea onChange={(e) => {
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
                        <option value="TJ">TJ</option>
                        <option value="TRT">TRT</option>
                        <option value="TRF">TRF</option>
                        <option value="TST">TST</option>
                        <option value="JEC">TSE</option>
                        <option value="JEC">TRE</option>
                        <option value="STJ">STJ</option>
                        <option value="STF">STF</option>
                        <option value="STM">STM</option>
                        <option value="JEC">JEC</option>
                        <option value="JECRIM">JECRIM</option>
                        <option value="JEFAZ">JEFAZ</option>
                    </select>
                </div>
                <Process_button className='form-button' type="submit">Enviar</Process_button>
            </Process_Form>
            <Division_Line />
        </>
    )
}