import { useState, useEffect } from "react"
import { CountProcesses, Info_Container, WorkerInfo, MainWorker_Count, AdmOnly_Button } from "./style"
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
  Filler,
  DoughnutController,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js"
import axios from "axios"

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
        Legend,
        Filler
    )

// defaults.maintainAspectRatio = false;
// defaults.responsive = true;

export default function VisaoGeral({ NomeColaborador, CodigoColaborador, CodigoTipoColaborador }){

    // Variáveis dos graficos
    const [countProcess, set_countProcess] = useState(null) // Contador de processos
    // Da pra otimizar
    const [countFasesAll, set_countFasesAll] = useState([]) // Contador de fases de processos
    const [countStatusAll, set_countStatusAll] = useState([]) // Contador Status de tarefas
    const [countMyTasks, set_countMyTasks] = useState(null) // Contador das minha tarefas
    const [countMyTasksByMonth, set_countMyTasksByMonth] = useState([]) // Array Contador de tarefas minhas
    const [countMyFinTasksByMonth, set_countMyFinTasksByMonth] = useState([]) // Array Contador de tarefas finalizadas minhas
    const [countMyUNFinTasksByMonth, set_countMyUNFinTaskByMonth] = useState([]) // Array Contador de tarefas não finalizadas minhas
    const [countTasksByMonth, set_countTasksByMonth] = useState([]) // Array Contador de tarefas
    const [countFinTasksByMonth, set_countFinTasksByMonth] = useState([]) // Array Contador de tarefas finalizadas
    const [countUNFinTasksByMonth, set_countUNFinTaskByMonth] = useState([]) // Array Contador de tarefas não finalizadas
    
    // variáveis de estado
    const [submit, set_submit] = useState(true)

    // Inserindo os dados nas variáveis
    useEffect(() => {
        (async () => {
            try{
                const response = await axios.get("http://localhost:5000/get_MainInfo", {
                    params: { colaborador: CodigoColaborador }
                })
                console.log(response.data)
                const fase = response.data
                set_countProcess(response.data.qtd_Processo)
                set_countFasesAll([fase.Conhecimento, fase.Recursal, fase.Execução, fase.Finalizado, fase.Cancelado])
                set_countStatusAll([fase.Aguardando, fase.Em_andamento, fase.Concluido])

                // Contador de tarefas para todos
                set_countMyTasksByMonth([fase.qtd_MyTaskByMonth1, fase.qtd_MyTaskByMonth2, fase.qtd_MyTaskByMonth3,
                    fase.qtd_MyTaskByMonth4, fase.qtd_MyTaskByMonth5, fase.qtd_MyTaskByMonth6, fase.qtd_MyTaskByMonth7, 
                    fase.qtd_MyTaskByMonth8, fase.qtd_MyTaskByMonth9, fase.qtd_MyTaskByMonth10, fase.qtd_MyTaskByMonth11, 
                    fase.qtd_MyTaskByMonth12
                ])
                set_countMyFinTasksByMonth([fase.qtdF_MyTaskByMonth1, fase.qtdF_MyTaskByMonth2, fase.qtdF_MyTaskByMonth3, 
                    fase.qtdF_MyTaskByMonth4, fase.qtdF_MyTaskByMonth5, fase.qtdF_MyTaskByMonth6, fase.qtdF_MyTaskByMonth7,
                    fase.qtdF_MyTaskByMonth8, fase.qtdF_MyTaskByMonth9, fase.qtdF_MyTaskByMonth10, fase.qtdF_MyTaskByMonth11,   
                    fase.qtdF_MyTaskByMonth12 
                ])
                set_countMyUNFinTaskByMonth([fase.qtdUNF_MyTaskByMonth1, fase.qtdUNF_MyTaskByMonth2, fase.qtdUNF_MyTaskByMonth3, 
                    fase.qtdUNF_MyTaskByMonth4, fase.qtdUNF_MyTaskByMonth5, fase.qtdUNF_MyTaskByMonth6, fase.qtdUNF_MyTaskByMonth7,
                    fase.qtdUNF_MyTaskByMonth8, fase.qtdUNF_MyTaskByMonth9, fase.qtdUNF_MyTaskByMonth10, fase.qtdUNF_MyTaskByMonth11,   
                    fase.qtdUNF_MyTaskByMonth12
                ])

                // Advogados apenas
                set_countTasksByMonth([fase.qtd_TaskByMonth1, fase.qtd_TaskByMonth2, fase.qtd_TaskByMonth3,
                    fase.qtd_TaskByMonth4, fase.qtd_TaskByMonth5, fase.qtd_TaskByMonth6, fase.qtd_TaskByMonth7, 
                    fase.qtd_TaskByMonth8, fase.qtd_TaskByMonth9, fase.qtd_TaskByMonth10, fase.qtd_TaskByMonth11, 
                    fase.qtd_TaskByMonth12
                ])
                set_countFinTasksByMonth([fase.qtdF_TaskByMonth1, fase.qtdF_TaskByMonth2, fase.qtdF_TaskByMonth3, 
                    fase.qtdF_TaskByMonth4, fase.qtdF_TaskByMonth5, fase.qtdF_TaskByMonth6, fase.qtdF_TaskByMonth7,
                    fase.qtdF_TaskByMonth8, fase.qtdF_TaskByMonth9, fase.qtdF_TaskByMonth10, fase.qtdF_TaskByMonth11,   
                    fase.qtdF_TaskByMonth12 
                ])
                set_countUNFinTaskByMonth([fase.qtdUNF_TaskByMonth1, fase.qtdUNF_TaskByMonth2, fase.qtdUNF_TaskByMonth3, 
                    fase.qtdUNF_TaskByMonth4, fase.qtdUNF_TaskByMonth5, fase.qtdUNF_TaskByMonth6, fase.qtdUNF_TaskByMonth7,
                    fase.qtdUNF_TaskByMonth8, fase.qtdUNF_TaskByMonth9, fase.qtdUNF_TaskByMonth10, fase.qtdUNF_TaskByMonth11,   
                    fase.qtdUNF_TaskByMonth12
                ])

                set_countMyTasks(fase.qtd_MyTask)
            }
            catch(error){
                console.log("Erro ao incluir gráficos: " + error)
            }
        })()
    }, [])

    const AdminOnly_Submit = async (role) => {
        const ArgsSubmit = {
            role,
            activate: submit
        }
        await axios.post("http://localhost:5000/activate_AutoSubmit", ArgsSubmit)

    }

    return(
        <div style={{ padding: "20px"}}>
            <WorkerInfo $submitButton={submit}>
                <h1>{NomeColaborador}</h1>
                <hr />
                <p>Bem Vindo(a) ao sistema Acompanhamento Jurídico!</p>
                {CodigoTipoColaborador === 1 && (
                    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                        <AdmOnly_Button className="taskButton" onClick={() => {AdminOnly_Submit("task"); set_submit(e => !e)}}>Ativar auto Task Submit</AdmOnly_Button>
                        <AdmOnly_Button className="intButton" onClick={() => {AdminOnly_Submit("int"); set_submit(e => !e)}}>Ativar auto Int Submit</AdmOnly_Button>
                    </div>
                )}
            </WorkerInfo>
            {CodigoTipoColaborador === 2 || CodigoTipoColaborador === 1 && (
                <MainWorker_Count>
                    <Line
                        data={{
                            labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                            datasets: [
                                {
                                    label: "Tarefas adicionadas",
                                    data: [
                                        countTasksByMonth[0],
                                        countTasksByMonth[1],
                                        countTasksByMonth[2],
                                        countTasksByMonth[3],
                                        countTasksByMonth[4],
                                        countTasksByMonth[5],
                                        countTasksByMonth[6],
                                        countTasksByMonth[7],
                                        countTasksByMonth[8],
                                        countTasksByMonth[9],
                                        countTasksByMonth[10],
                                        countTasksByMonth[11],             
                                    ],
                                    backgroundColor: "rgba(0, 60, 255, 0.2)", 
                                    borderColor: "rgba(0, 60, 255, 0.5)",
                                    fill: true,
                                },
                                {
                                    label: "Tarefas Pendentes",
                                    data: [
                                        countUNFinTasksByMonth[0],
                                        countUNFinTasksByMonth[1],
                                        countUNFinTasksByMonth[2],
                                        countUNFinTasksByMonth[3],
                                        countUNFinTasksByMonth[4],
                                        countUNFinTasksByMonth[5],
                                        countUNFinTasksByMonth[6],
                                        countUNFinTasksByMonth[7],
                                        countUNFinTasksByMonth[8],
                                        countUNFinTasksByMonth[9],
                                        countUNFinTasksByMonth[10],
                                        countUNFinTasksByMonth[11],                
                                    ],
                                    backgroundColor: "rgba(255, 196, 0, 0.2)", 
                                    borderColor: "rgba(255, 196, 0, 0.4)",
                                    fill: true,
                                },
                                {
                                    label: "Tarefas Concluídas",
                                    data: [
                                        countFinTasksByMonth[0],
                                        countFinTasksByMonth[1],
                                        countFinTasksByMonth[2],
                                        countFinTasksByMonth[3],
                                        countFinTasksByMonth[4],
                                        countFinTasksByMonth[5],
                                        countFinTasksByMonth[6],
                                        countFinTasksByMonth[7],
                                        countFinTasksByMonth[8],
                                        countFinTasksByMonth[9],
                                        countFinTasksByMonth[10],
                                        countFinTasksByMonth[11],                
                                    ],
                                    backgroundColor: "rgba(12, 255, 24, 0.2)", 
                                    borderColor: "rgba(12, 255, 24, 0.8)",
                                    fill: true,
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins:{
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Total de tarefas gerais adicionadas e concluídas por mês"
                                },
                                
                            },
                        }}
                    />
                </MainWorker_Count>
            )}
            <MainWorker_Count>
                <Line
                    data={{
                        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                        datasets: [
                            {
                                label: "Tarefas adicionadas",
                                data: [
                                    countMyTasksByMonth[0],
                                    countMyTasksByMonth[1],
                                    countMyTasksByMonth[2],
                                    countMyTasksByMonth[3],
                                    countMyTasksByMonth[4],
                                    countMyTasksByMonth[5],
                                    countMyTasksByMonth[6],
                                    countMyTasksByMonth[7],
                                    countMyTasksByMonth[8],
                                    countMyTasksByMonth[9],
                                    countMyTasksByMonth[10],
                                    countMyTasksByMonth[11],             
                                ],
                                backgroundColor: "rgba(0, 60, 255, 0.2)", 
                                borderColor: "rgba(0, 60, 255, 0.5)",
                                fill: true,
                            },
                            {
                                label: "Tarefas Peendentes",
                                data: [
                                    countMyUNFinTasksByMonth[0],
                                    countMyUNFinTasksByMonth[1],
                                    countMyUNFinTasksByMonth[2],
                                    countMyUNFinTasksByMonth[3],
                                    countMyUNFinTasksByMonth[4],
                                    countMyUNFinTasksByMonth[5],
                                    countMyUNFinTasksByMonth[6],
                                    countMyUNFinTasksByMonth[7],
                                    countMyUNFinTasksByMonth[8],
                                    countMyUNFinTasksByMonth[9],
                                    countMyUNFinTasksByMonth[10],
                                    countMyUNFinTasksByMonth[11],                
                                ],
                                backgroundColor: "rgba(255, 196, 0, 0.2)", 
                                borderColor: "rgba(255, 196, 0, 0.4)",
                                fill: true,
                            },
                            {
                                label: "Tarefas Concluídas",
                                data: [
                                    countMyFinTasksByMonth[0],
                                    countMyFinTasksByMonth[1],
                                    countMyFinTasksByMonth[2],
                                    countMyFinTasksByMonth[3],
                                    countMyFinTasksByMonth[4],
                                    countMyFinTasksByMonth[5],
                                    countMyFinTasksByMonth[6],
                                    countMyFinTasksByMonth[7],
                                    countMyFinTasksByMonth[8],
                                    countMyFinTasksByMonth[9],
                                    countMyFinTasksByMonth[10],
                                    countMyFinTasksByMonth[11],                
                                ],
                                backgroundColor: "rgba(12, 255, 24, 0.2)", 
                                borderColor: "rgba(12, 255, 24, 0.8)",
                                fill: true,
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        plugins:{
                            legend: { position: "top" },
                            title: {
                                display: true,
                                text: "Total de tarefas minhas adicionadas e concluídas por mês"
                            },
                            
                        },
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
                                    data: [countStatusAll[0], countStatusAll[1], countStatusAll[2]],
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
                                    data: [countFasesAll[0], countFasesAll[1], countFasesAll[2], countFasesAll[3], countFasesAll[4]],
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