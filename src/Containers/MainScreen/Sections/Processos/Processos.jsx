import { Process_Form, Process_button } from "./style"
import { useState } from "react"
import { NumericFormat } from 'react-number-format'
import axios from "axios"

export default function Processos(){
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

    return(
        <>
            <h1>Adicionar um processo</h1>
            <hr />
            <Process_Form action={"submit"} method="post">
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
                    console.log(e.target.value) //VERIFICAR OQ O STATE PEGA QUANDO DIGITADO APENAS VIRGULA
                    const NewValue = parseFloat(e.target.value.replace(/\./g, "").replace(",", ".").replace("R$ ", ""))
                    set_Causa(NewValue)
                }} 
                autoComplete="off" name="vl_Causa" id="vl_Causa" className="input" type="text" required/>
                </div>
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
                    <option value="TR">TR</option>
                    <option value="TRT">TRT</option>
                    <option value="TRF">TRF</option>
                    <option value="TST">TST</option>
                    <option value="JEC">TSE</option>
                    <option value="JEC">TRE</option>
                    <option value="STJ">STJ</option>
                    <option value="STF">STF</option>
                    <option value="STM">STM</option>
                    <option value="JEC">JEC</option>
                    <option value="JECRIM">JECRIM</option>
                    <option value="JEFAZ">JEFAZ</option>
                </select>
                </div>
                <Process_button className='form-button' onClick={handleSubmit}>Enviar</Process_button>
            </Process_Form>
            <hr />
        </>
    )
}