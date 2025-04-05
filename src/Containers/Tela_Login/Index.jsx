import { Container, InputSld, H_align } from './style'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import 'animate.css';

export default function Login(){

    const navigate = useNavigate();
    const [Login, setLogin] = useState("")
    const [Pass, setPass] = useState("")

    const handleLogin = (e) => {
        e.preventDefault() // Evita que a página recarregue

        const form = e.target
        if(form.checkValidity()){navigate("/main")}
        else{form.reportValidity()}
    }

    return(
        <H_align>
            <Container onSubmit={handleLogin}>
                <h1>Bem-vindo ao Acompanhamento Jurídico</h1>
                <InputSld>
                    <div className={`input-container ${Login.length > 0 ? "has-text" : ""}`}>
                        <input type="text" id="input" onChange={(e) => {
                            const MinimunLenght = e.target
                            setLogin(MinimunLenght.value)
                            if(MinimunLenght.value.length < 6){MinimunLenght.setCustomValidity('O campo deve ter no mínimo 6 caracteres.')}
                            else{MinimunLenght.setCustomValidity('')}
                        }} required />
                        <label htmlFor="input" className="label">Usuário</label>
                        <div className="underline" />
                    </div>
                </InputSld>
                <InputSld>
                    <div className={`input-container ${Pass.length > 0 ? "has-text" : ""}`}>
                        <input type="password" id="input" onChange={(e) => {
                            const MinimunLenght = e.target
                            setPass(MinimunLenght.value)
                            if(MinimunLenght.value.length < 8){MinimunLenght.setCustomValidity('O campo deve ter no mínimo 8 caracteres.')}
                            else{MinimunLenght.setCustomValidity('')}
                        }} required />
                        <label htmlFor="input" className="label">Senha</label>
                        <div className="underline" />
                    </div>
                </InputSld>
                <button className='btn' type='submit'>Entrar</button>
            </Container>
        </H_align>
    )
}