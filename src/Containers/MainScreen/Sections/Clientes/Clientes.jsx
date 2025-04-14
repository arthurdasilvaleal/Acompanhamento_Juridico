import { Client_form, Client_button } from "./style"
import { useState, useEffect } from "react"
import { InputMask } from "@react-input/mask"
import axios from "axios"

export default function Clientes({ Section, DataLoaded, set_DataLoaded }){
    const [nm_Cliente, set_nmCliente] = useState("")
    const [cd_CPF, set_cdCPF] = useState("")
    const [cd_Telefone, set_cdTelefone] = useState("")
    const [cd_CEP, set_cdCEP] = useState("")
    const [nm_Logradouro, set_nmLogradouro] = useState("")
    const [nm_Cidade, set_nmCidade] = useState("")
    const [nm_Estado, set_nmEstado] = useState("")
    const [cd_NumeroEndereco, set_cdNumeroEndereco] = useState("")
    const [nm_Complemento, set_nmComplemento] = useState("")
    const [ds_Email, set_dsEmail] = useState("")
    
    const searchData = async () => {
        try{
            const response = await axios.get("http://127.0.0.1:5000/clientes")
            console.log(response.data)
        }
        catch (error) {console.error("Erro ao buscar dados:", error)}
    }

    //Tentativa de buscar dados ao clicar em "Clientes"
    useEffect(() => {
        if (Section === "Clientes" && !DataLoaded) {
            set_DataLoaded(true)
            searchData()
        }
    }, [Section, DataLoaded])

    const buscarCep = async (cep) => {
        try{
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()
            console.log(response.data)
        
            if(!data.erro){
                set_nmLogradouro(data.logradouro)
                set_nmCidade(data.localidade)
                set_nmEstado(data.estado)
            }
            else {
                alert("CEP não encontrado!")
            }
        } catch (error){console.error("Erro ao buscar CEP:", error)}
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
    }

    return(
        <>
            <h1>Adicionar um Cliente</h1>
            <hr />
            <Client_form action={"submit"} method='post'>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Processo">Nome</label>
                    <input onChange={(e) => set_nmCliente(e.target.value)} autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="cd_CPF">CPF</label>
                    <input onChange={(e) => set_cdCPF(e.target.value)} autoComplete="off" name="cd_CPF" id="cd_CPF" className="input" type="text" required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="cd_CEP">CEP</label>
                    <InputMask mask="_____-___" 
                    replacement={{ _: /\d/ }} onChange={(e) => {
                        const catchCep = e.target.value
                        set_cdCEP(catchCep)
                        if(catchCep.replace(/\D/g, "").length === 8){buscarCep(catchCep)}
                        if(catchCep.length < 9){e.target.setCustomValidity("CEP incompleto!")}
                        else{e.target.setCustomValidity("")}
                    }} autoComplete="off" name="cd_CEP" id="cd_CEP" className="input" type="text" required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Logradouro">Logradouro</label>
                    <input onChange={(e) => set_nmLogradouro(e.target.value)} autoComplete="off" name="nm_Logradouro" id="nm_Logradouro" className="input" type="text" value={nm_Logradouro} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Cidade">Cidade</label>
                    <input onChange={(e) => set_nmCidade(e.target.value)} autoComplete="off" name="nm_Cidade" id="nm_Cidade" className="input" type="text" value={nm_Cidade} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Estado">Estado</label>
                    <input onChange={(e) => set_nmEstado(e.target.value)} autoComplete="off" name="nm_Estado" id="nm_Estado" className="input" type="text" value={nm_Estado} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="cd_NumeroEndereco">Número</label>
                    <input onChange={(e) => set_cdNumeroEndereco(e.target.value)} autoComplete="off" name="cd_NumeroEndereco" id="cd_NumeroEndereco" className="input" type="text" required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Complemento">Complemento</label>
                    <input onChange={(e) => set_nmComplemento(e.target.value)} autoComplete="off" name="nm_Complemento" id="nm_Complemento" className="input" type="text" required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="cd_Telefone">Telefone</label>
                    <InputMask mask="(__) _____-____" replacement={{ _: /\d/ }}
                    onChange={(e) => {
                        const Check_Tel = e.target.value
                        const valueParsed = parseInt(Check_Tel.replace("(", "").replace(")", "").replace("-", "").replace(" ", "").replace("_", ""))
                        set_cdTelefone(valueParsed)
                        if(Check_Tel.length < 15){e.target.setCustomValidity("Telefone incompleto!")}
                        else{e.target.setCustomValidity("")}
                    }} autoComplete="off" name="cd_Telefone" id="cd_Telefone" className="input" type="text" required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="ds_Email">E-mail</label>
                    <input onChange={(e) => set_dsEmail(e.target.value)} autoComplete="off" name="ds_Email" id="ds_Email" className="input" type="email" required/>
                </div>
                <Client_button onClick={handleSubmit}>Adicionar</Client_button>
            </Client_form>
            <hr />
        </>
    )
}