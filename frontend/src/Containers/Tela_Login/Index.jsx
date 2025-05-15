import { Container, InputSld } from './style'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import document from "../../gifs/document.gif"
import gavel from "../../gifs/gavel.gif"
import libra from "../../gifs/libra.gif"

export default function Login(){

    const navigate = useNavigate();
    const [Login, set_Login] = useState("ana_paula")
    const [Pass, set_Pass] = useState("")

    // Variáveis de estado
    const [LoginBlocked, set_LoginBlocked] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()

        const params = {Login, Pass}
        try{
            const response = await axios.post("http://localhost:5000/submit_login", params)
            
            if(response.data.success){
                // console.log(response.data)
                navigate("/main", {
                    state: {
                        nome: response.data.user.nm_Colaborador,
                        tipo: response.data.user.nm_TipoColaborador
                    }
                })
            }
        }
        catch(error){
            console.error("Erro ao tentar logar:", error)
            set_LoginBlocked(true)
            set_Login("")
            set_Pass("")
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
            <InputSld $loged={LoginBlocked}>
                <div className={`input-container ${Login.length > 0 ? "has-text" : ""}`}>
                    <input type="text" id="input-user" onChange={(e) => {
                        const MinimunLenght = e.target
                        set_Login(MinimunLenght.value)
                        if(MinimunLenght.value.length < 6){MinimunLenght.setCustomValidity('O campo deve ter no mínimo 6 caracteres.')}
                        else{MinimunLenght.setCustomValidity('')}
                    }} autoComplete='off' required value={Login} />
                    <label htmlFor="input-user" className="label">Usuário</label>
                    <div className="underline" />
                </div>
            </InputSld>
            <InputSld $loged={LoginBlocked}>
                <div className={`input-container ${Pass.length > 0 ? "has-text" : ""}`}>
                    <input type="password" id="input-pass" onChange={(e) => {
                        const MinimunLenght = e.target
                        set_Pass(MinimunLenght.value)
                        // if(MinimunLenght.value.length < 8){MinimunLenght.setCustomValidity('O campo deve ter no mínimo 8 caracteres.')}
                        // else{MinimunLenght.setCustomValidity('')}
                    }} autoComplete='off' required value={Pass}/>
                    <label htmlFor="input-pass" className="label">Senha</label>
                    <div className="underline" />
                </div>
                <p>Usuário ou senha incorretos</p>
            </InputSld>
            <button className='btn' type='submit'>Entrar</button>
        </Container>
    )
}