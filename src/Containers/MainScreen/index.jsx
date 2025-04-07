import { Container, Main_Menu, Main_Content, Main_button, Process_Form, Main_Title } from './style.jsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import Logo from '../../Images/logo.png'
import axios from 'axios'

export default function MainScreen() {

  // Requisições (METODO GET)
  const [Nome, set_Nome] = useState("")
  const [CPF, set_CPF] = useState("")
  const [Telefone, set_Telefone] = useState("")

  const searchData = async () => {
    try{
      const response = await axios.get("http://127.0.0.1:5000/clientes")
      console.log(response.data)
      set_Nome(response.data[0].nm_Cliente)
      set_CPF(response.data[0].cd_CPF)
      set_Telefone(response.data[0].cd_Telefone)
    }
    catch (error) {console.error("Erro ao buscar dados:", error)}
  }

  // Requisições (METODO POST [adicionar processo - Tela Processo])
  const [cd_NumProcesso, set_NumProcesso] = useState("")
  const [nm_Autor, set_Autor] = useState("")
  const [nm_Reu, set_Reu] = useState("")
  const [nm_Cidade, set_Cidade] = useState("")
  const [vl_Causa, set_Causa] = useState("")
  const [ds_Juizo, set_Juizo] = useState("")
  const [ds_Acao, set_Acao] = useState("")
  const [sg_Tribunal, set_Tribunal] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const Add_Processo = {
      cd_NumProcesso,
      nm_Autor,
      nm_Reu,
      nm_Cidade,
      vl_Causa,
      ds_Juizo,
      ds_Acao,
      sg_Tribunal
    }
  
    try{
      const response = await axios.post("http://localhost:5173/processo", Add_Processo)
      console.log("Processo adicionado com sucesso:", response.data)
      alert("Processo adicionado com sucesso!")
    } catch (error) {
      console.error("Erro ao adicionar processo:", error)
    }
  }

  const [option, setOption] = useState("Visão Geral")
  const contentMap = {
    "Visão Geral": <>
                    <Main_button onClick={searchData}>Pegar dados</Main_button>
                    <p><strong>Nome: {Nome}, CPF: {CPF}, Telefone: {Telefone}</strong></p>
                  </>,
    "Clientes": <></>,
    "Processos": <>
                     <h1>Adicionar um processo</h1>
                     <hr />
                    <Process_Form action="submit" method="post">
                      <div className="main-form">
                        <div className="left-form">
                          <div className="input-group">
                            <label className="label" htmlFor="nm_Processo">Número do processo</label>
                            <input onChange={(e) => set_NumProcesso(e.target.value)} autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" required/>
                          </div>
                          <div className="input-group">
                            <label className="label" htmlFor="nm_Autor">Nome do autor</label>
                            <input onChange={(e) => set_Autor(e.target.value)} autoComplete="off" name="nm_Autor" id="nm_Autor" className="input" type="text" required/>
                          </div>
                          <div className="input-group">
                            <label className="label" htmlFor="nm_Reu">Nome do réu</label>
                            <input onChange={(e) => set_Reu(e.target.value)} autoComplete="off" name="nm_Reu" id="nm_Reu" className="input" type="text" required/>
                          </div>
                          <div className="input-group">
                            <label className="label" htmlFor="nm_Cidade">Cidade</label>
                            <input onChange={(e) => set_Cidade(e.target.value)} autoComplete="off" name="nm_Cidade" id="nm_Cidade" className="input" type="text" required/>
                          </div>
                          <div className="input-group">
                            <label className="label" htmlFor="vl_Causa">Valor da Causa</label>
                            <NumericFormat thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale prefix="R$ "
                            allowNegative={false} onChange={(e) => {
                              const NewValue = parseFloat(e.target.value.replace(/\./g, "").replace(",", ".").replace("R$ ", ""))
                              set_Causa(NewValue)
                            }} 
                            autoComplete="off" name="vl_Causa" id="vl_Causa" className="input" type="text" required/>
                          </div>
                        </div>
                        <div className="right-form">
                          <div className="input-group">
                            <label className="label" htmlFor="ds_Juizo">Descrição do juizado</label>
                            <textarea onChange={(e) => set_Juizo(e.target.value)} autoComplete="off" name="ds_Juizo" id="ds_Juizo" className="input" type="text" required/>
                          </div>
                          <div className="input-group">
                            <label className="label" htmlFor="ds_Acao">Descrição da ação</label>
                            <textarea onChange={(e) => set_Acao(e.target.value)} autoComplete="off" name="ds_Acao" id="ds_Acao" className="input" type="text" required/>
                          </div>
                          <div className="input-group-select">
                            <label className="label" htmlFor="sg_Tribunal">Tribunal</label>
                            <select onChange={(e) => set_Tribunal(e.target.value)} name="sg_Tribunal" id="sg_Tribunal" className="input-select" required>
                              <option value="">Selecione</option>
                              <option value="TJ">TJ</option>
                              <option value="TRT">TRT</option>
                              <option value="TRF">TRF</option>
                              <option value="STJ">STJ</option>
                              <option value="STF">STF</option>
                              <option value="JECRIM">JECRIM</option>
                              <option value="JEFAZ">JEFAZ</option>
                              <option value="TR">TR</option>
                              <option value="TST">TST</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <Main_button className='form-button' onClick={handleSubmit}>Enviar</Main_button>
                    </Process_Form>
                    
                    <hr />
                  </>,
    "Intimações": <></>,
    "Tarefas": <></>,
    "Relatórios": <></>
  }

  const SubTitleObject = {
    SubTitles: [
      <p key="Visão Geral">Seja bem-vindo ao sistema de gestão de processos judiciais!</p>,
      <p key="Clientes">Aqui você pode visualizar e gerenciar todos os clientes cadastrados.</p>,
      <p key="Processos">Adicione e gerencie processos de forma eficiente.</p>,
      <p key="Intimações">Veja todas as intimações pendentes e arquivadas.</p>,
      <p key="Tarefas">Organize suas tarefas e prazos importantes.</p>,
      <p key="Relatórios">Visualize relatórios detalhados das suas atividades.</p>
    ]
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