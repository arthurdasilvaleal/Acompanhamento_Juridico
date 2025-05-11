import { useState } from "react"
import { Link } from 'react-router-dom'
import { H_align, Container, Inputs_box, Header, Twin_input } from './style.jsx'
import { InputMask } from "@react-input/mask"
import { cpf } from 'cpf-cnpj-validator'

export default function Cadastro(){
    const [cep, set_Cep] = useState("")
    const [CPF, set_CPF] = useState("")
    const [telefone, set_Telefone] = useState("")
    const [endereco, set_Endereco] = useState("")
    const [cidade, set_Cidade] = useState("")
    const [bairro, set_Bairro] = useState("")
    const [estado, set_Estado] = useState("")
    const [email, set_Email] = useState("")
    const [ID, setID] = useState("")
    const [password, set_Password] = useState("")
    const [retype, set_Retype] = useState("")
    const PassEqual = password === retype || retype === "";
    
    const buscarCep = async (cep) => {
        try{
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()
        
            if(!data.erro){
                set_Endereco(data.logradouro)
                set_Cidade(data.localidade)
                set_Estado(data.uf)
                set_Bairro(data.bairro)
            }
            else {
                alert("CEP não encontrado!")
            }
        } catch (error){console.error("Erro ao buscar CEP:", error)}
    }

    return(
        <H_align>
            <Container>
                <Header>
                    <Link to={"/"}>
                        <div className="styled-wrapper">
                            <button className="button">
                                <div className="button-box">
                                    <span className="button-elem">
                                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                                            <path fill="black" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                        </svg>
                                    </span>
                                    <span className="button-elem">
                                        <svg fill="black" viewBox="0 0  24 24" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                                        </svg>
                                    </span>
                                </div>
                            </button>
                        </div>
                    </Link>
                    <h1>Cadastre sua conta</h1>
                </Header>
                <Twin_input>
                    <Inputs_box>
                        <div className="input-container">
                            <input type="text" className="input" required />
                            <label htmlFor="input" className="label">Nome</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                    <Inputs_box>
                        <div className={`input-container ${CPF.length > 0 ? "has-text" : ""}`}>
                            <InputMask type="text" className="input" mask="___.___.___-__" 
                            replacement={{ _: /\d/ }} onChange={(e) => {
                                const Check_CPF = e.target.value
                                set_CPF(Check_CPF)
                                if(Check_CPF.length < 14){e.target.setCustomValidity("CPF incompleto!")}
                                else if(!cpf.isValid(Check_CPF)){e.target.setCustomValidity("CPF inválido!")}
                                else{e.target.setCustomValidity("")}
                            }}
                            value={CPF} data-valido={cpf.isValid(CPF) || CPF.length < 14} required />
                            <label htmlFor="input" className="label" data-valido={cpf.isValid(CPF) || CPF.length < 14}>CPF</label>
                            <div className="underline" data-valido={cpf.isValid(CPF) || CPF.length < 14}/>
                        </div>
                    </Inputs_box>
                </Twin_input>
                <Twin_input>
                    <Inputs_box>
                        <div className="input-container">
                            <InputMask type="text" className="input" mask="(__) _____-____" replacement={{ _: /\d/ }}
                            onChange={(e) => {
                                const Check_Tel = e.target.value
                                set_Telefone(Check_Tel)
                                if(Check_Tel.length < 15){e.target.setCustomValidity("Telefone incompleto!")}
                                else{e.target.setCustomValidity("")}
                            }} value={telefone} required />
                            <label htmlFor="input" className="label">Celular</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                    <Inputs_box>
                        <div className={`input-container ${email.length > 0 ? "has-text" : ""}`}>
                            <input type="email" className="input" required value={email} 
                                onChange={(e) => set_Email(e.target.value)} />
                            <label htmlFor="input" className="label">E-mail</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                </Twin_input>
                <Twin_input>
                    <Inputs_box>
                        <div className={`input-container ${cep.length > 0 ? "has-text" : ""}`}>
                            <InputMask type="text" className="input" mask="_____-___" 
                            replacement={{ _: /\d/ }} onChange={(e) => {
                                const catchCep = e.target.value;
                                set_Cep(catchCep);
                                if(catchCep.replace(/\D/g, "").length === 8){buscarCep(catchCep)}
                                if(catchCep.length < 9){e.target.setCustomValidity("CEP incompleto!")}
                                else{e.target.setCustomValidity("")}
                            }} value={cep} required />
                            <label htmlFor="input" className="label">CEP</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                        <Inputs_box>
                            <div className="input-container">
                                <input type="text" className="input" value={endereco} onChange={(e) => set_Endereco(e.target.value)} required />
                                <label htmlFor="input" className="label">Endereço</label>
                                <div className="underline" />
                            </div>
                        </Inputs_box>
                </Twin_input>
                <Twin_input>
                    <Inputs_box>
                        <div className="input-container">
                            <input type="text" className="input" value={cidade} onChange={(e) => set_Cidade(e.target.value)} required />
                            <label htmlFor="input" className="label">Cidade</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                    <Inputs_box>
                        <div className="input-container">
                            <input type="text" className="input" value={bairro} onChange={(e) => set_Bairro(e.target.value)} required />
                            <label htmlFor="input" className="label">Bairro</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                </Twin_input>
                <Twin_input>
                    <Inputs_box>
                        <div className="input-container">
                            <input type="text" className="input" value={estado} onChange={(e) => set_Estado(e.target.value)} required />
                            <label htmlFor="input" className="label">Estado</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                    <Inputs_box>
                        <div className={`input-container ${ID.length > 0 ? "has-text" : ""}`}>
                            <input type="text" className="input" onChange={(e) => {
                                const Catch_ID = e.target
                                setID(Catch_ID.value)
                                if(Catch_ID.value.length < 6){Catch_ID.setCustomValidity("Seu ID deve ter ao menos 6 caracteres.")}
                                else{Catch_ID.setCustomValidity("")}
                            }} required />
                            <label htmlFor="input" className="label">Login Usuário</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                </Twin_input>
                <Twin_input>
                    <Inputs_box>
                        <div className={`input-container ${password.length > 0 ? "has-text" : ""}`}>
                            <input type="password" className="input" id="first-pass" required 
                                onChange={(e) => {
                                    const Catch_Pass = e.target
                                    set_Password(Catch_Pass.value)
                                    if(!/[A-Z]/.test(Catch_Pass.value) && !/[a-z]/.test(Catch_Pass.value) && !/[0-9]/.test(Catch_Pass.value))
                                        {Catch_Pass.setCustomValidity("A senha deve conter ao menos:\nUma letra maiúscula;\nUma minúscula;\nUm número.")}
                                    else if(!/[A-Z]/.test(Catch_Pass.value) && !/[a-z]/.test(Catch_Pass.value))
                                        {Catch_Pass.setCustomValidity("A senha deve conter ao menos:\nUma letra maiúscula;\nUma minúscula.")}
                                    else if(!/[A-Z]/.test(Catch_Pass.value) && !/[0-9]/.test(Catch_Pass.value))
                                        {Catch_Pass.setCustomValidity("A senha deve conter ao menos:\nUma letra maiúscula;\nUm número.")}
                                    else if(!/[a-z]/.test(Catch_Pass.value) && !/[0-9]/.test(Catch_Pass.value))
                                        {Catch_Pass.setCustomValidity("A senha deve conter ao menos:\nUma minúscula;\nUm número.")}
                                    else if(!/[A-Z]/.test(Catch_Pass.value))
                                        {Catch_Pass.setCustomValidity("A senha deve conter ao menos uma letra maiúscula.")}
                                    else if(!/[a-z]/.test(Catch_Pass.value))    
                                        {Catch_Pass.setCustomValidity("A senha deve conter ao menos uma letra minúscula.")}
                                    else if(!/[0-9]/.test(Catch_Pass.value))
                                        {Catch_Pass.setCustomValidity("A senha deve conter ao menos um número.")}
                                    else if(Catch_Pass.value.length < 6)
                                        {Catch_Pass.setCustomValidity("A senha deve ter ao menos 6 caracteres.")}
                                    else{Catch_Pass.setCustomValidity("")}
                                    {/*TODO: Otimizar essa parte(retirar os IFs)*/}
                                }} maxLength={26}/>
                            <label htmlFor="input" className="label">Criar senha</label>
                            <div className="underline" />
                        </div>
                    </Inputs_box>
                    <Inputs_box>
                        <div className="input-container">
                            <input type="password" className="input" id="second-pass" required 
                                onChange={(e) => {
                                    const Catch_Retype = e.target
                                    set_Retype(Catch_Retype.value)
                                    if(Catch_Retype.value !== password){Catch_Retype.setCustomValidity("As senhas precisam ser iguais!")}
                                    else{Catch_Retype.setCustomValidity("")}
                                }} data-valido={PassEqual} pattern={password}/>
                            <label htmlFor="input" className="label" data-valido={PassEqual}>Redigite a senha</label>
                            <div className="underline" data-valido={PassEqual}/>
                        </div>
                    </Inputs_box>
                </Twin_input>
                <button className='btn'>Cadastrar</button>
            </Container>
        </H_align>
    )
}