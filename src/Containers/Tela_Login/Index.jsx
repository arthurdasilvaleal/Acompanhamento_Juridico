import { Container, InputSld, H_align } from './style'
import { Link, useNavigate } from 'react-router-dom'
import 'animate.css';

export default function Login(){

    const navigate = useNavigate();

    const handleLogin = () => {
        // Aqui você pode validar os dados antes de redirecionar
        navigate("/main")
    }

    return(
        <H_align>
            <Container>
                <h1>Bem-vindo ao Acompanhamento Jurídico</h1>
                <InputSld>
                    <div className="input-container">
                        <input type="text" id="input" required />
                        <label htmlFor="input" className="label">Usuário</label>
                        <div className="underline" />
                    </div>
                </InputSld>
                <InputSld>
                    <div className="input-container">
                        <input type="password" id="input" required />
                        <label htmlFor="input" className="label">Senha</label>
                        <div className="underline" />
                    </div>
                </InputSld>
                <h6><Link to={'/cadastro'}>Não tem uma conta?</Link></h6>
                <button className='btn' onClick={handleLogin}>Entrar</button>
            </Container>
        </H_align>
    )
}