import { Container, InputSld } from './style'
import Loading_screen from '../../components/Loading_Form/Loading'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import document from "../../gifs/document.gif"
import gavel from "../../gifs/gavel.gif"
import libra from "../../gifs/libra.gif"
import LoadingPage from '../../components/Loading_Pages/Loading'

export default function Login(){

    const navigate = useNavigate();
    const [Login, set_Login] = useState("ana_paula")
    const [Pass, set_Pass] = useState("")

    // Variáveis de estado
    const [LoginPass, set_LoginPass] = useState(false)
    const [Loading, set_Loading] = useState(false)
    const [loadingScreen, set_LoadingScreen] = useState(true)
    
    const handleLogin = async (e) => {
        e.preventDefault()

        const params = {Login, Pass}
        try{
            set_Loading(true)
            const response = await axios.post("http://192.168.100.3:5000/submit_login", params)
            
            if(response.data.success){
                localStorage.setItem("logado", "true")
                set_Loading(false)
                navigate("/main", {
                    state: {
                        nome: response.data.user.nm_Colaborador,
                        tipo: response.data.user.nm_TipoColaborador,
                        codigo: response.data.user.cd_Colaborador
                    }
                })
            } 
        }
        catch(error){
            console.error("Erro ao tentar logar:", error)
            set_LoginPass(true)
            set_Login("")
            set_Pass("")
            set_Loading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() =>{set_LoadingScreen(false)}, 1500)
        
        return () => clearTimeout(timer)
    }, [])

    // useEffect(() => {
    //     document.body.style.backgroundImage = "url('../../Images/bg.png')"

    //     return () => {
    //         document.body.style.backgroundImage = ""
    //     }
    // }, [])


    return(
        <>
        {loadingScreen && (<LoadingPage />)}
        
            <Container onSubmit={handleLogin}>
                <div className='gifs'>
                    <img src={document} alt="processos" />
                    <img src={libra} alt="libra" />
                    <img src={gavel} alt="martelo" />
                </div>
                <h1>Bem-vindo ao Acompanhamento Jurídico</h1>
                <InputSld $loged={LoginPass}>
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
                <InputSld $loged={LoginPass}>
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
                {Loading && (<Loading_screen />)}
            </Container>
        </>
    )
}