import { Grid_Box, Search_box } from "./style"
import { useState, useEffect } from "react"
import Clientes from "./Clientes/Clientes"

export default function Consulta_Cliente(){

    const [allClientes, set_allClientes] = useState([])

    useEffect(() =>{
        
    }, [])

    return(
        <>
        <Search_box>
            <label htmlFor="">Nome do cliente</label>
            <input type="text" />
        </Search_box>
            <Grid_Box>

            </Grid_Box>
            <Clientes />
        </>
    )
}