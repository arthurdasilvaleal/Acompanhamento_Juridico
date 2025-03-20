import { Container, Main_Menu, Main_Content } from './style.jsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../Images/logo.png'

export default function MainScreen() {

  const [option, setOption] = useState("Visão Geral")
  const contentMap = {
    "Visão Geral": <>
                    <p>Seja bem-vindo ao sistema de gestão de processos judiciais!</p>
                    <h2>Hello, second world</h2>
                  </>,
    "Clientes": <p>Aqui estão os clientes cadastrados no sistema.</p>,
    "Processos": <p>Gerencie seus processos judiciais com eficiência.</p>,
    "Intimações": <p>Veja todas as intimações pendentes e arquivadas.</p>,
    "Tarefas": <p>Organize suas tarefas e prazos importantes.</p>,
    "Configurações": <p>Configure as preferências do sistema.</p>,
    "Relatórios": <p>Visualize relatórios detalhados das suas atividades.</p>
  }

  return (
    <Container>
      <Main_Menu>
        <img src={Logo} alt="Logo" />
        <ul>
          {Object.keys(contentMap).map((item) => (
            <li key={item} onClick={() => setOption(item)}
            data-active={option === item}>
              {item}
            </li>
          ))}
        </ul>
        <button id="bottone1"><Link to={'/'}><strong>Sair</strong></Link></button>
      </Main_Menu>
      <Main_Content>
        <h1>{option}</h1>
        {contentMap[option]}
      </Main_Content>
    </Container>
  )
}