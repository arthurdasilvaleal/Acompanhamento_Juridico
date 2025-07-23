import { useState, useEffect } from "react"
import { CountProcesses } from "./style"
import { Doughnut, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

import axios from "axios"

export default function VisaoGeral(){

    // Variáveis dos graficos
    const [countProcess, set_countProcess] = useState(null) // Contador de processos
    // Da pra otimizar
    const [countFase1, set_countFase1] = useState(null) // Contador Fase1
    const [countFase2, set_countFase2] = useState(null) // Contador Fase2
    const [countFase3, set_countFase3] = useState(null) // Contador Fase3
    const [countFase4, set_countFase4] = useState(null) // Contador Fase4

    // Componentes do Chart.js
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    )

    useEffect(() => {
        (async () => {
            try{
                const response = await axios.get("http://10.107.200.6:5000/get_MainInfo")
                console.log(response.data)
                set_countProcess(response.data.qtd_Processo)
                set_countFase1(response.data.qtd_ProcessoFase1)
                set_countFase2(response.data.qtd_ProcessoFase2)
                set_countFase3(response.data.qtd_ProcessoFase3)
                set_countFase4(response.data.qtd_ProcessoFase4)
            }
            catch(error){
                console.log("Erro ao incluir grafico: " + error)
            }
            
        })()

    }, [])


    return(
        <div style={{ padding: "20px"}}>
            <CountProcesses>
                <Bar
                    data={{ 
                        labels: ["Conhecimento", "Recursal", "Execução", "Finalizado", "Total"],
                        datasets: [
                            {
                                label: "Fases",
                                data: [countFase1, countFase2, countFase3, countFase4, countProcess],
                                backgroundColor: [
                                    "rgba(141, 54, 250, 0.8)",
                                    "rgba(141, 197, 250, 0.8)",
                                    "rgba(255, 100, 39, 0.8)",
                                    "rgba(5, 197, 39, 0.8)",
                                    "rgba(22, 40, 250, 0.8)"

                                ]
                            },
                        ],
                    }}
                    options={{ 
                        responsive: true,
                        plugins:{
                            legend: { position: "top" },
                            title: {
                                display: true,
                                text: "Quantidade de Processos por Status"
                            }
                        }
                    }}
                >

                </Bar>
            </CountProcesses>
            
        </div>
    )
}