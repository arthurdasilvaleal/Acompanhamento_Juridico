import { Client_form, Client_button } from "./style"
import { useState, useEffect } from "react"
import { NumericFormat } from 'react-number-format'
import axios from "axios"

export default function Clientes({ Section, DataLoaded, set_DataLoaded }){
    const [nm_Cliente, set_nmCliente] = useState("")
    const [cd_CPF, set_cdCPF] = useState("")
    const [cd_Telefone, set_cdTelefone] = useState("")
    
    
    const searchData = async () => {
        try{
            const response = await axios.get("http://127.0.0.1:5000/clientes")
            console.log(response.data)
        }
        catch (error) {console.error("Erro ao buscar dados:", error)}
    }

    //Tentativa de buscar dados ao clicar em "Clientes"
    useEffect(() => {
        if (Section === "Clientes" && !DataLoaded) {
            set_DataLoaded(true)
            searchData()
        }
    }, [Section, DataLoaded])

    return(
        <>
            <h1>Adicionar um Cliente</h1>
            <hr />
            <Client_form action={"submit"} method='post'>
            <div className="input-group">
                <label className="label" htmlFor="nm_Processo">Número do processo</label>
                <input onChange={(e) => set_nmCliente(e.target.value)} autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" required/>
            </div>
            </Client_form>
        </>
    )
}