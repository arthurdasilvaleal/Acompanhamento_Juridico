import { Client_form, Client_button, FixedBox } from "./style"
import { useState } from "react"
import { InputMask } from "@react-input/mask"
import { cpf, cnpj } from 'cpf-cnpj-validator'
import Modal from '../../../../../components/Modal/Modal'
import Loading_form from "../../../../../components/Loading_Form/Loading"
import axios from 'axios'

export default function Clientes({ showWindow }){
    const [nm_Cliente, set_nmCliente] = useState("")
    const [cd_CPF, set_cdCPF] = useState("")
    const [cd_CEP, set_cdCEP] = useState("")
    const [nm_Logradouro, set_nmLogradouro] = useState("")
    const [nm_Bairro, set_nmBairro] = useState("")
    const [nm_Cidade, set_nmCidade] = useState("")
    const [sg_Estado, set_sgEstado] = useState("")
    const [cd_NumeroEndereco, set_cdNumeroEndereco] = useState("")
    const [nm_Complemento, set_nmComplemento] = useState("")
    const [cd_Telefone, set_cdTelefone] = useState("")
    const [ds_Email, set_dsEmail] = useState("")

    // Variáveis de status
    const [Loading, set_Loading] = useState(false)

    // Variáveis do modal
    const [isModalOpen, set_ModalOpen] = useState(false)
    const [formStatusMessage, set_FormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_fromStatusErrorMessage] = useState("")

    // Busca dados ao clicar em "Clientes"
    const buscarCep = async (cep) => {
        try{
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()
        
            if(!data.erro){
                set_nmLogradouro(data.logradouro)
                set_nmBairro(data.bairro)
                set_nmCidade(data.localidade)
                set_sgEstado(data.uf)
            }
            else {
                alert("CEP não encontrado!")
            }
        } catch (error){console.error("Erro ao buscar CEP:", error)}
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        set_Loading(true)

        const cleaned_CEP = cd_CEP.replace(/\D/g, "")
        const cleaned_Telefone = cd_Telefone.replace(/\D/g, "")
        const cleaned_CPF = cd_CPF.replace(/\D/g, "")

        const post_cliente = {
            nm_Cliente,
            cd_CPF: cleaned_CPF,
            cd_Telefone: cleaned_Telefone,
            cd_CEP: cleaned_CEP,
            nm_Logradouro,
            nm_Bairro,
            nm_Cidade,
            sg_Estado,
            cd_NumeroEndereco,
            nm_Complemento,
            ds_Email
        }

        try{
            const response = await axios.post("http://192.168.100.3:5000/post_cliente", post_cliente)
            console.log("Cliente adicionado com sucesso:", response.data)
            set_FormStatusMessage("Cliente adicionado com sucesso!")
            set_ModalOpen(true)
            set_fromStatusErrorMessage("")
            set_Loading(false)

            // Resetando o formulário
            set_nmCliente("")
            set_cdCPF("")
            set_cdTelefone("")
            set_cdCEP("")
            set_nmLogradouro("")
            set_nmBairro("")
            set_nmCidade("")
            set_sgEstado("")
            set_cdNumeroEndereco("")
            set_nmComplemento("")
            set_dsEmail("")
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error)
            set_FormStatusMessage("Erro ao Adicionar cliente.")
            set_fromStatusErrorMessage(error.response.data.error)
            set_ModalOpen(true)
            set_Loading(false)
        }
    }

    return(
        <FixedBox $show={showWindow}>
            {Loading && (<Loading_form />)}
            <h1>Adicionar um Cliente</h1>
            <hr />
            <Client_form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="label" htmlFor="cd_CPF">CPF / CNPJ</label>
                    <InputMask mask={cd_CPF.length <= 13 ? "___.___.___-__" : "__.___.___/____-__"} replacement={{ _: /\d/ }} onChange={(e) => {
                        const Check_CPF = e.target.value
                        set_cdCPF(Check_CPF)
                        if(Check_CPF.length < 14){e.target.setCustomValidity("CPF/CNPJ incompleto!")}
                        else if(!cpf.isValid(Check_CPF) && Check_CPF.length === 14){e.target.setCustomValidity("CPF inválido!")}
                        else if(Check_CPF.length > 14 && Check_CPF.length < 18){e.target.setCustomValidity("CNPJ incompleto!")}
                        else if(!cnpj.isValid(Check_CPF) && Check_CPF.length === 18){e.target.setCustomValidity("CNPJ Inválido!")}
                        else{e.target.setCustomValidity("")}
                    }} autoComplete="off" name="cd_CPF" id="cd_CPF" className="input" type="text" value={cd_CPF} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Processo">Nome</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_nmCliente(ParsedString)}}
                        autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" value={nm_Cliente} required/>
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
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_nmLogradouro(ParsedString)}} autoComplete="off" name="nm_Logradouro" id="nm_Logradouro" className="input" type="text" value={nm_Logradouro} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Logradouro">Bairro</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_nmBairro(ParsedString)}} autoComplete="off" name="nm_Logradouro" id="nm_Logradouro" className="input" type="text" value={nm_Bairro} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Cidade">Cidade</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_nmCidade(ParsedString)}} autoComplete="off" name="nm_Cidade" id="nm_Cidade" className="input" type="text" value={nm_Cidade} required/>
                </div>
                <div className="input-group-select">
                    <label className="label" htmlFor="sg_Estado">UF</label>
                    <select onChange={(e) => set_sgEstado(e.target.value)} name="sg_Estado" id="sg_Estado" className="input-select" value={sg_Estado} required>
                        <option value="">Selecione</option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="DF">DF</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PR">PB</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="cd_NumeroEndereco">Número</label>
                    <InputMask mask="_______" replacement={{ _: /\d/ }} onChange={(e) => set_cdNumeroEndereco(e.target.value)} autoComplete="off" name="cd_NumeroEndereco" id="cd_NumeroEndereco" className="input" type="text" value={cd_NumeroEndereco} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Complemento">Complemento</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, "")
                        set_nmComplemento(ParsedString)}} autoComplete="off" name="nm_Complemento" id="nm_Complemento" className="input" type="text" value={nm_Complemento} maxLength={20} required/>
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
            {/* <hr style={{ height: "50px", backgroundColor: "#343434", border: "none", margin: "16px 0 0 0"}}/> */}
            <Modal isOpen={isModalOpen} onClose={() => set_ModalOpen(false)} message={formStatusMessage} messageError={fromStatusErrorMessage}/>
        </FixedBox>
    )
}