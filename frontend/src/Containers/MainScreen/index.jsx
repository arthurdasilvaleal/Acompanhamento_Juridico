import { Container, Main_Menu, Main_Content, Main_Title, Main_ToggleButton, Exit_card, Animated_background } from './style.jsx'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import VisaoGeral from './Sections/GeneralMenu/VisãoGeral.jsx'
import Consulta_Processo from './Sections/Consulta_Processo/Consulta_Processo.jsx'
import Consulta_Cliente from './Sections/Consulta_Cliente/Consulta_Cliente.jsx'
import Report from './Sections/Relatorios/Report.jsx'
import Logo from '../../Images/logo.png'
import Loading_page from '../../components/Loading_Pages/Loading.jsx'

export default function MainScreen() {
  const [option, setOption] = useState("Visão Geral")
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() =>{set_Loading(false)}, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  const {nome, tipo, codigo, codigoTipo} = location.state || {} // Se location.state for vazio, usará um objeto vazio
  const unSex = () => {
    if(tipo === "Estagiário" || tipo === "Advogado"){
      return "(a)"
    }
    return ""
  }

  // Variáveis de estado
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const [Loading, set_Loading] = useState(true)
  const [Exit, set_Exit] = useState(false)
  const [Exit_Interacted, set_ExitInteracted] = useState(false)

  useEffect(() => {

    if(Exit) return

    function handleClickOutside(event) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
    
  }, [menuOpen, Exit])

  const contentMap = {
    "Visão Geral": <VisaoGeral NomeColaborador={nome} CodigoColaborador={codigo} CodigoTipoColaborador={codigoTipo}/>,
    "Processos": <Consulta_Processo CodigoColaborador={codigo} TipoColaborador={tipo} NomeColaborador={nome}/>,
    "Clientes": <Consulta_Cliente TipoColaborador={tipo}/>,
    "Relatórios": <Report />
  }

  const SubTitleObject = {
    SubTitles: [
      <p key="Visão Geral">Seja bem-vindo ao sistema de gestão de processos judiciais!</p>,
      <p key="Processos">Aqui você pode adicionar processos, intimações e tarefas, bem como editar processos</p>,
      <p key="Clientes">Confira os dados detalhados, adicione e edite novos clientes</p>,
      <p key="Relatórios">Visualize relatórios detalhados das suas atividades</p>
    ]
  }

  if(contentMap !== "Processos"){document.body.style.overflow = "visible"}

  document.body.style.backgroundColor = "#343434"
  // Debug de renderizações de componentes
  // const renderCount = useRef(0)
  // renderCount.current += 1
  // console.log("Componente renderizado", renderCount.current, "vezes")

  return (
    <>
      {Loading && (<Loading_page />)}
      <Container $isOpen={menuOpen}>
        <Main_ToggleButton ref={buttonRef} $isOpen={menuOpen} onClick={() => setMenuOpen(prev => !prev)} />
        <Main_Menu ref={menuRef} $isOpen={menuOpen} $Exiting={Exit}>
          <img src={Logo} alt="Logo" />
          <div className='Info'>
            <p><strong>{nome}</strong></p>
            <p><strong>{tipo + unSex()}</strong></p>
          </div>
          <ul>
            {Object.keys(contentMap).map((item) => (
              <li key={item} onClick={() => setOption(item)}
              data-active={option === item}>
                {item}
              </li>
            ))}
          </ul>
          <button onClick={() => {
            set_Exit(true)
            set_ExitInteracted(true)
            }} id="bottone1"><strong>Sair</strong></button>
        </Main_Menu>

        <Main_Content $isBlocked={menuOpen} $Exiting={Exit}>
          <Animated_background />

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
        <Exit_card $Exiting={Exit} $Visible={Exit_Interacted}>
          <svg onClick={() => set_Exit(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          <h2>Você realmente deseja sair?</h2>
          <Link to={'/'} onClick={() => localStorage.removeItem("logado")}><button className='btn'>Sair</button></Link>
        </Exit_card>
      </Container>
    </>
  )
}