import { Container, InputSld, H_align } from './style'
import { Link } from 'react-router-dom'
import LogoAJ from "../../Images/Logo AJ.jpg"

export default function Login(){
    return(
        <H_align>
            <img src={LogoAJ} alt="Logo Acompanhamento Juridico" />
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
                    <input type="text" id="input" required />
                    <label htmlFor="input" className="label">Senha</label>
                    <div className="underline" />
                </div>
                </InputSld>
                <h6><Link to={'/cadastro'}>Não tem uma conta?</Link></h6>
                <button className='btn'>Entrar</button>
            </Container>
        </H_align>
    )
}