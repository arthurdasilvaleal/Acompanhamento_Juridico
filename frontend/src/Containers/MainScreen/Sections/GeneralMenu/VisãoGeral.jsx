import { useState, useEffect } from "react"
import { CountProcesses, Info_Container, WorkerInfo } from "./style"
import { Doughnut, Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  defaults,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement
} from "chart.js"
import axios from "axios"

// defaults.maintainAspectRatio = false;
// defaults.responsive = true;

export default function VisaoGeral({ NomeColaborador }){

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
        DoughnutController,
        ArcElement,
        Title,
        Tooltip,
        Legend
    )

    // Inserindo os dados nas variáveis
    useEffect(() => {
        (async () => {
            try{
                const response = await axios.get("http://192.168.100.3:5000/get_MainInfo")
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
            <WorkerInfo>
                <h1>{NomeColaborador}</h1>
                <hr />
                <p>Bem Vindo(a) ao sistema Acompanhamento Jurídico!</p>
            </WorkerInfo>

            <Info_Container>
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

                                    ],
                                    borderRadius: 5,
                                },
                            ],
                        }}
                        options={{
                            plugins:{
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Quantidade de Processos por Status"
                                }
                            }
                        }}
                    />
                </CountProcesses>
                <CountProcesses>
                    <Doughnut
                        data={{ 
                            labels: ["Conhecimento", "Recursal", "Execução", "Finalizado" ],
                            datasets: [
                                {
                                    label: "Fases",
                                    data: [countFase1, countFase2, countFase3, countFase4],
                                    backgroundColor: [
                                        "rgba(141, 54, 250, 0.8)",
                                        "rgba(141, 197, 250, 0.8)",
                                        "rgba(255, 100, 39, 0.8)",
                                        "rgba(5, 197, 39, 0.8)"
                                    ],
                                    borderRadius: 5,
                                },
                            ],
                        }}
                        options={{
                            plugins:{
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Quantidade de Processos por Status"
                                }
                            }
                        }}
                    />
                </CountProcesses>
            </Info_Container>
        </div>
    )
}