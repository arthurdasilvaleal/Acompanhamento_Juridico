import { useState, useEffect } from "react";
import { } from "./style.jsx"
import Processos from './Processos/Processos.jsx'
import Clientes from './Clientes/Clientes.jsx'

export default function Adicionar(){
    return(
        <>
            <Clientes />
            <Processos />
        </>
    )
}