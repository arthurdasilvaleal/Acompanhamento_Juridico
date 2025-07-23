import { useState, useEffect } from "react"
import { Container } from "./style"
import axios from "axios"

export default function VisaoGeral(){

    // Variáveis dos graficos
    const [countProcess, set_countProcess] = useState([]) // Contador de processos

    useEffect(() => {
        (async () => {
            try{
                const response = await axios.get("http://192.168.100.3:5000/get_MainInfo")
                console.log(response)
                set_countProcess(response.data.qtd_Processo)
            }
            catch(error){
                console.log("Erro ao incluir grafico: " + error)
            }
            
        })()

    }, [])


    return(
        <Container>
            <h2>Quantidade de processos: {countProcess}</h2>
            <h2>Prazos iminentes: </h2>
            <h2>Notificações: </h2>
        </Container>
    )
}