import { H_align, Container, Inputs_box } from './style.jsx'

export default function Cadastro(){
    return(
        <H_align>
            <Container>
                <h1>Cadastrar</h1>
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" id="input" required />
                        <label htmlFor="input" className="label">Nome</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" id="input" required />
                        <label htmlFor="input" className="label">E-mail</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" id="input" required />
                        <label htmlFor="input" className="label">CEP</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="text" id="input" required />
                        <label htmlFor="input" className="label">Endereço</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="password" id="input" required />
                        <label htmlFor="input" className="label">Criar senha</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
                <Inputs_box>
                    <div className="input-container">
                        <input type="password" id="input" required />
                        <label htmlFor="input" className="label">Redigite a senha</label>
                        <div className="underline" />
                    </div>
                </Inputs_box>
            </Container>
        </H_align>
    )
}