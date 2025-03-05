import { useState } from "react";
import { Link, redirect } from 'react-router-dom'
import { H_align, Container, Inputs_box, Header } from './style.jsx'

export default function Cadastro(){
    const [email, set_Email] = useState("")
    const [password, set_Password] = useState("")
    const [retype, set_Retype] = useState("")
    const PassEqual = password === retype || retype === "";

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
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" className="input" required />
                        <label htmlFor="input" className="label">Nome</label>
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
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" className="input" required />
                        <label htmlFor="input" className="label">CEP</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" className="input" required />
                        <label htmlFor="input" className="label">Endereço</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" className="input" required />
                        <label htmlFor="input" className="label">Cidade</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className={`input-container ${password.length > 0 ? "has-text" : ""}`}>
                        <input type="password" className="input" id="first-pass" required 
                            pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,15}$'
                            onChange={(e) => set_Password(e.target.value)}/>
                        <label htmlFor="input" className="label">Criar senha</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="password" className="input" id="second-pass" required 
                            onChange={(e) => {set_Retype(e.target.value)}}
                            data-valido={PassEqual}/>
                        <label htmlFor="input" className="label" data-valido={PassEqual}>Redigite a senha</label>
                        <div className="underline" data-valido={PassEqual}/>
                    </div>
                </Inputs_box>
                <button className='btn'>Cadastrar</button>
            </Container>
        </H_align>
    )
}