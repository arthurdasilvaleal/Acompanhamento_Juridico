import {useState, useEffect } from 'react'
import { Intimation_form, Intimation_button } from './style'

export default function Intimacoes(){
    const [cd_Processo, set_cdProcesso] = useState("")
    const [ds_Intimacao, set_dsIntimacao] = useState("")
    const [dt_Recebimento, set_dtRecebimento] = useState("")

    const handleSubmit = async () => {
        e.preventDefault()

        const post_Intimacao = {
            cd_Processo,
            ds_Intimacao,
            dt_Recebimento
        }

        
    }

    return(
        <>
            <h1>Registrar Intimação</h1>
            <Intimation_form>
                <div className="input-group">
                    <label className="label" htmlFor="cd_Processo">Número do processo</label>
                    <input onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/\D/g, "")
                        set_cdProcesso(ParsedInteger)}} autoComplete="off" name="cd_Processo" id="cd_Processo" className="input" type="text" value={cd_Processo} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="ds_Intimacao">Descrição da Intimação</label>
                    <textarea onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ,.\s]/g, "")
                        set_dsIntimacao(ParsedString)}} autoComplete="off" name="ds_Intimacao" id="ds_Intimacao" className="input" type="text" value={ds_Intimacao} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="dt_Recebimento">Data do Recebimento</label>
                    <input onChange={(e) => set_dtRecebimento(e.target.value)}
                    autoComplete="off" name="dt_Recebimento" id="dt_Recebimento" className="input" type="date" value={dt_Recebimento} required/>
                </div>
                <Intimation_button className='form-button' type="submit">Enviar</Intimation_button>
            </Intimation_form>
        </>
    )
}