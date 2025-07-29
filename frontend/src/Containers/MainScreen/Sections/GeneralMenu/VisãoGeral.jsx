import { useState, useEffect } from "react"
import { CountProcesses, Info_Container, WorkerInfo, MainWorker_Count } from "./style"
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
  ArcElement,
  PointElement,
  LineElement
} from "chart.js"
import axios from "axios"

// defaults.maintainAspectRatio = false;
// defaults.responsive = true;

export default function VisaoGeral({ NomeColaborador, CodigoColaborador }){

    // Variáveis dos graficos
    const [countProcess, set_countProcess] = useState(null) // Contador de processos
    // Da pra otimizar
    const [countFase1, set_countFase1] = useState(null) // Contador Fase1
    const [countFase2, set_countFase2] = useState(null) // Contador Fase2
    const [countFase3, set_countFase3] = useState(null) // Contador Fase3
    const [countFase4, set_countFase4] = useState(null) // Contador Fase4
    const [countFase5, set_countFase5] = useState(null) // Contador Fase5
    const [countStatus1, set_countStatus1] = useState(null) // Contador Status1
    const [countStatus2, set_countStatus2] = useState(null) // Contador Status2
    const [countStatus3, set_countStatus3] = useState(null) // Contador Status3
    const [countMyTasks, set_countMyTasks] = useState(null) // Contador das minha tarefas

    // Componentes do Chart.js
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        DoughnutController,
        ArcElement,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    )

    // Inserindo os dados nas variáveis
    useEffect(() => {
        (async () => {
            try{
                const response = await axios.get("http://192.168.100.3:5000/get_MainInfo", {
                    params: { colaborador: CodigoColaborador }
                })
                console.log(response.data)
                set_countProcess(response.data.qtd_Processo)
                set_countFase1(response.data.qtd_ProcessoFase1)
                set_countFase2(response.data.qtd_ProcessoFase2)
                set_countFase3(response.data.qtd_ProcessoFase3)
                set_countFase4(response.data.qtd_ProcessoFase4)
                set_countFase5(response.data.qtd_ProcessoFase5)
                set_countStatus1(response.data.qtd_TarefaStatus1)
                set_countStatus2(response.data.qtd_TarefaStatus2)
                set_countStatus3(response.data.qtd_TarefaStatus3)
                set_countMyTasks(response.data.qtd_MyTask)
            }
            catch(error){
                console.log("Erro ao incluir gráficos: " + error)
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
            <MainWorker_Count>
                <Line
                    data={{
                        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                        datasets: [
                            {
                                label: "Venda",
                                data: [200, 300, 500],
                                backgroundColor: [
                                    "rgb(255, 22, 22)",
                                    "rgb(0, 243, 101)",
                                    "rgb(0, 60, 255)", 
                                ],
                                borderColor: "rgba(0, 0, 0, 0.2)"
                            }
                        ]
                    }}
                    options={{
                        plugins:{
                            legend: { position: "top" },
                            title: {
                                display: true,
                                text: "Total de tarefas adicionadas e concluídas por mês"
                            }
                        }
                    }}
                />
            </MainWorker_Count>
            <Info_Container>
                <CountProcesses>
                    <Bar
                        data={{ 
                            labels: ["Aguardando", "Em andamento", "Concluído"],
                            datasets: [
                                {
                                    label: "Situação",
                                    data: [countStatus1, countStatus2, countStatus3],
                                    backgroundColor: [
                                        "rgba(255, 205, 86, 0.6)",
                                        "rgba(255, 159, 64, 0.6)",
                                        "rgba(75, 192, 192, 0.6)",
                                    ],
                                    borderColor: [
                                        "rgb(255, 205, 86)",
                                        "rgb(255, 159, 64)",
                                        "rgb(75, 192, 192)",
                                    ],
                                    borderWidth: 3,
                                    borderRadius: 5,
                                    
                                },
                            ],
                        }}
                        options={{
                            plugins:{
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Situação das Tarefas de intimações"
                                }
                            }
                        }}
                    />
                </CountProcesses>
                <CountProcesses>
                    <Doughnut
                        data={{ 
                            labels: ["Conhecimento", "Recursal", "Execução", "Finalizado", "Cancelado"],
                            datasets: [
                                {
                                    label: "Fases",
                                    data: [countFase1, countFase2, countFase3, countFase4, countFase5],
                                    backgroundColor: [
                                        "rgba(141, 54, 250, 0.8)",
                                        "rgba(141, 197, 250, 0.8)",
                                        "rgba(255, 100, 39, 0.8)",
                                        "rgba(5, 197, 39, 0.8)",
                                        "rgba(255, 16, 16, 0.8)"
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