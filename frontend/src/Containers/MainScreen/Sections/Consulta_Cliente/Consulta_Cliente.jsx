import { Grid_Box, Search_box, Consult_button } from "./style"
import { useState, useEffect } from "react"
import Clientes from "./Add_Clientes/Clientes"

export default function Consulta_Cliente(){

    const [allClientes, set_allClientes] = useState([]) // Clientes adicionados
    
    // Variáveis de Estado
    const [addCliente, set_addCliente] = useState(false)

    useEffect(() =>{
        
    }, [])

    return(
        <>
            <Search_box>
                <label htmlFor="">Nome do cliente</label>
                <input type="text" />
                <Consult_button type="button" onClick={() => set_addCliente(prev => !prev)}>Adicionar Cliente</Consult_button>
            </Search_box>
            
            <Grid_Box>
                <div className="card-Client">
                    <p>Nome: fulando de tal</p>
                </div>
            </Grid_Box>
            <Clientes showWindow={addCliente}/>
        </>
    )
}