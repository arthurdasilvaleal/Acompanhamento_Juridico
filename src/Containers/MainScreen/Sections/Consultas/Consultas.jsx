import { useState, useEffect } from "react"
import { Consult_form, Consult_button } from "./style"
import Clientes from "./Clientes/Clientes"
import Processos from "./Processos/Processos"

export default function(){
    const [cd_NumeroProcesso, set_cdNumeroEndereco] = useState("")
    const [nm_Cliente, set_nmCliente] = useState("")
    const [buttonClicked, set_buttonClicked] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        set_buttonClicked(true)
    }

    return(
        <>
            <Consult_form $Enviado={buttonClicked} onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="label" htmlFor="cd_NumeroProcesso">Número do Processo</label>
                    <input onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/[^0-9]/g, "")
                        set_cdNumeroEndereco(ParsedInteger)}}
                        autoComplete="off" name="cd_NumeroProcesso" id="cd_NumeroProcesso" className="input" type="text" value={cd_NumeroProcesso} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Cliente">Cliente</label>
                    <input onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/[^a-zA-ZÀ-ÿ]/g, "")
                        set_nmCliente(ParsedInteger)}}
                        autoComplete="off" name="nm_Cliente" id="nm_Cliente" className="input" type="text" value={nm_Cliente} required/>
                </div>
                <Consult_button className="form-button" type="submit">Pesquisar</Consult_button>
            </Consult_form>
        </>
    )
}