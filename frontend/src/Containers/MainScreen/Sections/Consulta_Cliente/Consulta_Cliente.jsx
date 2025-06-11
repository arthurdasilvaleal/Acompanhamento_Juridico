import { Grid_Box } from "./style"
import { useState, useEffect } from "react"
import Clientes from "./Clientes/Clientes"

export default function Consulta_Cliente(){

    const [allClientes, set_allClientes] = useState([])

    useEffect(() =>{
        
    }, [])

    return(
        <>
            <Grid_Box>

            </Grid_Box>
            <Clientes />
        </>
    )
}