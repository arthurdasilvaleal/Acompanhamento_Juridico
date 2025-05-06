import { Container, Main_Menu, Main_Content, Main_Title, Main_ToggleButton } from './style.jsx'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import VisaoGeral from './Sections/GeneralMenu/VisãoGeral.jsx'
import Consulta from './Sections/Consultas/Consultas.jsx'
import Adicionar from './Sections/Adicionar/Adicionar.jsx'
import Logo from '../../Images/logo.png'

export default function MainScreen() {
  const [option, setOption] = useState("Visão Geral")
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const contentMap = {
    "Visão Geral": <VisaoGeral />,
    "Consultas": <Consulta />,
    "Adicionar": <Adicionar />,
    "Tarefas": <></>,
    "Relatórios": <></>
  }

  const SubTitleObject = {
    SubTitles: [
      <p key="Visão Geral">Seja bem-vindo ao sistema de gestão de processos judiciais!</p>,
      <p key="Consultas">Aqui você pode preencher as informações para consulta</p>,
      <p key="Adicionar">Adicione novos clientes e processos</p>,
      <p key="Tarefas">Organize suas tarefas e prazos importantes</p>,
      <p key="Relatórios">Visualize relatórios detalhados das suas atividades</p>
    ]
  }

  return (
    <Container $isOpen={menuOpen}>
      <Main_ToggleButton ref={buttonRef} $isOpen={menuOpen} onClick={() => setMenuOpen(prev => !prev)} />
      <Main_Menu ref={menuRef} $isOpen={menuOpen}>
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
      <Main_Content $isBlocked={menuOpen}>
        <Main_Title>
          <h1>{option}</h1>
          {/* Adicionando o subtitulo dinamicamente */}
          {SubTitleObject.SubTitles.map((item) => {
            if (item.key === option) {
              return item
            }
            return null
          })}
          <hr />
        </Main_Title>
        {contentMap[option]}
      </Main_Content>
    </Container>
  )
}