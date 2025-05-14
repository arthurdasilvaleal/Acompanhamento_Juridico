import { Container, InputSld } from './style'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import document from "../../gifs/document.gif"
import gavel from "../../gifs/gavel.gif"
import libra from "../../gifs/libra.gif"

export default function Login(){

    const navigate = useNavigate();
    const [Login, setLogin] = useState("")
    const [Pass, setPass] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()

        const params = {Login, Pass}
        try{
            const response = await axios.post("http://localhost:5000/submit_login", params)
            
            if(response.data.success){
                alert("Sucesso")
                console.log(response.data)
                navigate("/main", {
                    state: {
                        nome: response.data.user.nm_Colaborador,
                        codigo: response.data.user.cd_TipoColaborador
                    }
                })
            }
        }
        catch(error){
            console.error("Erro ao tentar logar:", error)
            alert(error.response.data.message)
        }
    }

    return(
        <Container onSubmit={handleLogin}>
            <div className='gifs'>
                <img src={document} alt="processos" />
                <img src={libra} alt="libra" />
                <img src={gavel} alt="martelo" />
            </div>
            <h1>Bem-vindo ao Acompanhamento Jurídico</h1>
            <InputSld>
                <div className={`input-container ${Login.length > 0 ? "has-text" : ""}`}>
                    <input type="text" id="input-user" onChange={(e) => {
                        const MinimunLenght = e.target
                        setLogin(MinimunLenght.value)
                        if(MinimunLenght.value.length < 6){MinimunLenght.setCustomValidity('O campo deve ter no mínimo 6 caracteres.')}
                        else{MinimunLenght.setCustomValidity('')}
                    }} autoComplete='off' required />
                    <label htmlFor="input-user" className="label">Usuário</label>
                    <div className="underline" />
                </div>
            </InputSld>
            <InputSld>
                <div className={`input-container ${Pass.length > 0 ? "has-text" : ""}`}>
                    <input type="password" id="input-pass" onChange={(e) => {
                        const MinimunLenght = e.target
                        setPass(MinimunLenght.value)
                        // if(MinimunLenght.value.length < 8){MinimunLenght.setCustomValidity('O campo deve ter no mínimo 8 caracteres.')}
                        // else{MinimunLenght.setCustomValidity('')}
                    }} autoComplete='off' required />
                    <label htmlFor="input-pass" className="label">Senha</label>
                    <div className="underline" />
                </div>
            </InputSld>
            <button className='btn' type='submit'>Entrar</button>
        </Container>
    )
}