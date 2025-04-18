import { Client_form, Client_button, Cliente_card } from "./style"
import { useState, useEffect } from "react"
import { InputMask } from "@react-input/mask"
import { cpf } from 'cpf-cnpj-validator'
import axios from "axios"

export default function Clientes({ Section, DataLoaded, set_DataLoaded }){
    const [nm_Cliente, set_nmCliente] = useState("")
    const [cd_CPF, set_cdCPF] = useState("")
    const [cd_CEP, set_cdCEP] = useState("")
    const [nm_Logradouro, set_nmLogradouro] = useState("")
    const [nm_Cidade, set_nmCidade] = useState("")
    const [nm_Estado, set_nmEstado] = useState("")
    const [cd_NumeroEndereco, set_cdNumeroEndereco] = useState("")
    const [nm_Complemento, set_nmComplemento] = useState("")
    const [cd_Telefone, set_cdTelefone] = useState("")
    const [ds_Email, set_dsEmail] = useState("")
    const [clientes, setClientes] = useState([])
    
    const searchData = async () => {
        try{
            const response = await axios.get("http://127.0.0.1:5000/get_clientes")
            console.log(response.data)
            setClientes(response.data)
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

        const cleaned_CEP = cd_CEP.replace(/\D/g, "")
        const cleaned_Telefone = cd_Telefone.replace(/\D/g, "")
        const cleaned_CPF = cd_CPF.replace(/\D/g, "")

        const post_cliente = {
            nm_Cliente,
            cd_CPF: cleaned_CPF,
            cd_Telefone: cleaned_Telefone,
            cd_CEP: cleaned_CEP,
            nm_Logradouro,
            nm_Cidade,
            nm_Estado,
            cd_NumeroEndereco,
            nm_Complemento,
            ds_Email
        }

        try{
            const response = await axios.post("http://127.0.0.1:5000/post_cliente", post_cliente)
            console.log("Processo adicionado com sucesso:", response.data)
            alert("Processo adicionado com sucesso!")

            searchData()

            // Resetando o formulário
            set_nmCliente("")
            set_cdCPF("")
            set_cdTelefone("")
            set_cdCEP("")
            set_nmLogradouro("")
            set_nmCidade("")
            set_nmEstado("")
            set_cdNumeroEndereco("")
            set_nmComplemento("")
            set_dsEmail("")
        } catch (error) {
            console.error("Erro ao adicionar processo:", error)
        }
    }

    return(
        <>
            <h1>Adicionar um Cliente</h1>
            <hr />
            <Client_form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Processo">Nome</label>
                    <input onChange={(e) => set_nmCliente(e.target.value)} autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" value={nm_Cliente} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="cd_CPF">CPF / CNPJ</label>
                    <InputMask mask="___.___.___-__" replacement={{ _: /\d/ }} onChange={(e) => {
                        const Check_CPF = e.target.value
                        set_cdCPF(Check_CPF)
                        if(Check_CPF.length < 14){e.target.setCustomValidity("CPF incompleto!")}
                        else if(!cpf.isValid(Check_CPF)){e.target.setCustomValidity("CPF inválido!")}
                        else{e.target.setCustomValidity("")}
                    }} autoComplete="off" name="cd_CPF" id="cd_CPF" className="input" type="text" value={cd_CPF} required/>
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
                    }} autoComplete="off" name="cd_CEP" id="cd_CEP" className="input" type="text" value={cd_CEP} required/>
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
                    <InputMask mask="_______" replacement={{ _: /\d/ }} onChange={(e) => set_cdNumeroEndereco(e.target.value)} autoComplete="off" name="cd_NumeroEndereco" id="cd_NumeroEndereco" className="input" type="text" value={cd_NumeroEndereco} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Complemento">Complemento</label>
                    <input onChange={(e) => set_nmComplemento(e.target.value)} autoComplete="off" name="nm_Complemento" id="nm_Complemento" className="input" type="text" value={nm_Complemento} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="cd_Telefone">Telefone</label>
                    <InputMask mask="(__) _____-____" replacement={{ _: /\d/ }}
                    onChange={(e) => {
                        const Check_Tel = e.target.value
                        set_cdTelefone(Check_Tel)
                        if(Check_Tel.length < 15){e.target.setCustomValidity("Telefone incompleto!")}
                        else{e.target.setCustomValidity("")}
                    }} autoComplete="off" name="cd_Telefone" id="cd_Telefone" className="input" type="text" value={cd_Telefone} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="ds_Email">E-mail</label>
                    <input onChange={(e) => set_dsEmail(e.target.value)} autoComplete="off" name="ds_Email" id="ds_Email" className="input" type="email" value={ds_Email} required/>
                </div>
                <Client_button type="submit">Adicionar</Client_button>
            </Client_form>
            <hr />
            <h1>Clientes cadastrados</h1>
            {clientes.length > 0 ? (
            <div className="clientes-lista">
                {clientes.map((cliente) => (
                <Cliente_card key={cliente.cd_Cliente}>
                    <h3>{cliente.nm_Cliente}</h3>
                    <p><strong>CPF:</strong> {cliente.cd_CPF}</p>
                    <p><strong>Telefone:</strong> {cliente.cd_Telefone}</p>
                    <p><strong>Email:</strong> {cliente.ds_Email}</p>
                    <p><strong>Endereço:</strong> {cliente.nm_Logradouro}, {cliente.cd_NumeroEndereco} {cliente.ds_ComplementoEndereco}</p>
                    <p><strong>Cidade/Estado:</strong> {cliente.nm_Cidade} - {cliente.nm_Estado}</p>
                    <p><strong>CEP:</strong> {cliente.cd_CEP}</p>
                    <hr />
                </Cliente_card>
                ))}
            </div>
            ) : (
            <p style={{ marginTop: "1rem" }}>Nenhum cliente cadastrado ainda.</p>
            )}

        </>
    )
}