import { useState, useEffect } from "react"
import { Consult_form, Consult_button, NotFound_Error, InputError, ProcessLeft_side, ProcessRight_side } from "./style"
import axios from "axios"

export default function Consulta(){
    const [cd_NumeroProcesso, set_cdNumeroEndereco] = useState("")
    const [cd_ListNumeroProcesso, set_cdListNumeroProcesso] = useState([])
    const [nm_Cliente, set_nmCliente] = useState("")
    const [processos, set_Processos] = useState([])
    const [foundProcess, set_foundProcess] = useState(false)
    const [notFound, set_NotFound] = useState(false)
    
    useEffect(() => {
        axios.get("http://192.168.100.3:5000/get_processos?only=numbers")
          .then(response => {
            set_cdListNumeroProcesso(response.data)
          })
          .catch(error => {
            console.error("Erro ao buscar processos:", error)
          })
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await axios.get("http://192.168.100.3:5000/get_processos", {params: { cd_NumeroProcesso }})
            console.log(response.data)
            set_Processos(response.data)
            if(response.data.length > 0){
                set_foundProcess(true)
                set_NotFound(false)
                console.log(notFound)
            }
            if(response.data.length == 0){
                set_foundProcess(false)
                set_NotFound(true)
            }
        }catch(error){
            console.error("Erro ao buscar processo:", error)
            set_NotFound(true)
        }
    }

    return(
        <>
            <Consult_form $Enviado={foundProcess} onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="label" htmlFor="cd_NumeroProcesso">Número do Processo</label>
                    <div>
                    <InputError onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/[^0-9]/g, "")
                        set_cdNumeroEndereco(ParsedInteger)}}
                    autoComplete="off" name="cd_NumeroProcesso" id="cd_NumeroProcesso" className="input" type="text" value={cd_NumeroProcesso} 
                    list="processes-number" $found_data={notFound} required/>
                    {notFound === true ? (<NotFound_Error>Processo não encontrado.</NotFound_Error>) : (<></>)}
                    </div>
                        <datalist id="processes-number">
                            {cd_ListNumeroProcesso.map((numero, index) => (
                                <option key={index} value={numero}></option>
                            ))}
                        </datalist>
                </div>
                {/* <div className="input-group">
                    <label className="label" htmlFor="nm_Cliente">Cliente</label>
                    <input onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/[^a-zA-ZÀ-ÿ]/g, "")
                        set_nmCliente(ParsedInteger)}}
                        autoComplete="off" name="nm_Cliente" id="nm_Cliente" className="input" type="text" value={nm_Cliente} required/>
                </div> */}
                    <Consult_button className="form-button" type="submit">Pesquisar</Consult_button>
            </Consult_form>
            {processos.length > 0 ? (
                <ProcessLeft_side>
                    {processos.map((processo) =>(
                        <div key={processo.cd_Processo}>
                            <h2>Processo {processo.cd_NumeroProcesso}</h2>
                        </div>
                    ))}
                </ProcessLeft_side>
            ) : (<></>)}
        </>
    )
}