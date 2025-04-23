import {useState, useEffect} from "react"
import { Container } from "./style"

export default function VisaoGeral(){
    return(
        <Container>
            <h2>Processos em andamento: </h2>
            <h2>Prazos iminentes: </h2>
            <h2>Notificações: </h2>
        </Container>
    )
}