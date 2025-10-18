import { useState, useEffect } from "react"
import { CountProcesses, Info_Container, WorkerInfo, MainWorker_Count, AdmOnly_Button } from "./style"
import { Doughnut, Line, Bar } from "react-chartjs-2"
import { motion, AnimatePresence } from "framer-motion"
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
    
    // Novas variáveis para gráficos adicionais
    const [performanceData, set_performanceData] = useState(null)
    const [workloadData, set_workloadData] = useState(null)
    const [processValueData, set_processValueData] = useState(null)
    const [deadlineData, set_deadlineData] = useState(null)
    const [taskTypeData, set_taskTypeData] = useState(null)
    const [efficiencyTrendsData, set_efficiencyTrendsData] = useState(null)
    const [personalStats, set_personalStats] = useState(null)

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

    // Buscar dados adicionais para novos gráficos
    useEffect(() => {
        (async () => {
            try {
                // Performance dos colaboradores
                const performanceResponse = await axios.get("http://localhost:5000/get_performance_data")
                set_performanceData(performanceResponse.data)

                // Distribuição de carga de trabalho
                const workloadResponse = await axios.get("http://localhost:5000/get_workload_data")
                set_workloadData(workloadResponse.data)

                // Análise de valor dos processos
                const processValueResponse = await axios.get("http://localhost:5000/get_process_value_data")
                set_processValueData(processValueResponse.data)

                // Análise de prazos
                const deadlineResponse = await axios.get("http://localhost:5000/get_deadline_data")
                set_deadlineData(deadlineResponse.data)

                // Tipos de tarefas
                const taskTypeResponse = await axios.get("http://localhost:5000/get_task_type_data")
                set_taskTypeData(taskTypeResponse.data)

                // Tendências de eficiência
                const efficiencyTrendsResponse = await axios.get("http://localhost:5000/get_efficiency_trends")
                set_efficiencyTrendsData(efficiencyTrendsResponse.data)

                // Estatísticas pessoais do colaborador
                const personalStatsResponse = await axios.get("http://localhost:5000/get_personal_stats", {
                    params: { colaborador: CodigoColaborador }
                })
                set_personalStats(personalStatsResponse.data)
            }
            catch(error) {
                console.log("Erro ao buscar dados adicionais: " + error)
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
            
            {/* Cards de Estatísticas Pessoais */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "15px", 
                margin: "20px 0",
                padding: "0 10px"
            }}>
                <AnimatePresence mode="wait">
                    {/* Loading State */}
                    {!personalStats && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                display: "contents"
                            }}
                        >
                            {[...Array(7)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ 
                                        duration: 0.4, 
                                        delay: index * 0.1,
                                        ease: "easeOut"
                                    }}
                                    style={{
                                        background: "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        textAlign: "center",
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}
                                >
                                    {/* Skeleton Loading Animation */}
                                    <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "-100%",
                                        width: "100%",
                                        height: "100%",
                                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                                        animation: "shimmer 1.5s infinite"
                                    }}></div>
                                    
                                    <div style={{
                                        height: "14px",
                                        background: "#ccc",
                                        borderRadius: "4px",
                                        margin: "0 0 10px 0",
                                        animation: "pulse 1.5s infinite"
                                    }}></div>
                                    
                                    <div style={{
                                        height: "28px",
                                        background: "#bbb",
                                        borderRadius: "4px",
                                        margin: "5px 0",
                                        animation: "pulse 1.5s infinite"
                                    }}></div>
                                    
                                    <style jsx>{`
                                        @keyframes shimmer {
                                            0% { left: -100%; }
                                            100% { left: 100%; }
                                        }
                                        @keyframes pulse {
                                            0%, 100% { opacity: 0.6; }
                                            50% { opacity: 1; }
                                        }
                                    `}</style>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Cards com Dados */}
                    {personalStats && (
                        <motion.div
                            key="data"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                display: "contents"
                            }}
                        >
                    {/* Card Total de Tarefas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.1,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>Total de Tarefas</h3>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                            style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}
                        >
                            {personalStats.total_tarefas || 0}
                        </motion.div>
                    </motion.div>

                    {/* Card Tarefas Concluídas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.6,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        style={{
                            background: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>Tarefas Concluídas</h3>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                            style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}
                        >
                            {personalStats.concluidas || 0}
                        </motion.div>
                    </motion.div>

                    {/* Card Tarefas Vencidas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.2,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        style={{
                            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>Tarefas Vencidas</h3>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                            style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}
                        >
                            {personalStats.tarefas_vencidas || 0}
                        </motion.div>
                    </motion.div>

                    {/* Card Próximas do Vencimento */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.3,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        style={{
                            background: "linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>Próximas do Vencimento</h3>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                            style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}
                        >
                            {personalStats.tarefas_proximas_vencimento || 0}
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            style={{ fontSize: "11px", opacity: 0.8, marginTop: "5px" }}
                        >
                            Vencem em até 3 dias
                        </motion.div>
                    </motion.div>

                    {/* Card No Prazo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.4,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        style={{
                            background: "linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>No Prazo</h3>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                            style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}
                        >
                            {personalStats.tarefas_no_prazo || 0}
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                            style={{ fontSize: "11px", opacity: 0.8, marginTop: "5px" }}
                        >
                            Vencem após 3 dias
                        </motion.div>
                    </motion.div>

                    {/* Card Taxa de Conclusão */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.5,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        style={{
                            background: "linear-gradient(135deg, #1dd1a1 0%, #55a3ff 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>Taxa de Conclusão</h3>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                            style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}
                        >
                            {personalStats.taxa_conclusao || 0}%
                        </motion.div>
                    </motion.div>

                    {/* Card Este Mês */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.7,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        style={{
                            background: "linear-gradient(135deg, #a55eea 0%, #26de81 100%)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }}
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", opacity: 0.9 }}>Tarefas Este Mês</h3>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.4, ease: "easeOut" }}
                            style={{ fontSize: "28px", fontWeight: "bold", margin: "5px 0" }}
                        >
                            {personalStats.tarefas_este_mes || 0}
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.3 }}
                            style={{ fontSize: "12px", opacity: 0.8 }}
                        >
                            {personalStats.tarefas_concluidas_este_mes || 0} concluídas
                        </motion.div>
                    </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
            
            {/* Novos gráficos adicionais */}
            {performanceData && performanceData.length > 0 && (
                <MainWorker_Count>
                    <Bar
                        data={{
                            labels: performanceData.map(item => item.nm_Colaborador),
                            datasets: [
                                {
                                    label: "Taxa de Conclusão (%)",
                                    data: performanceData.map(item => item.taxa_conclusao),
                                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                                    borderColor: "rgba(54, 162, 235, 1)",
                                    borderWidth: 2,
                                },
                                {
                                    label: "Total de Tarefas",
                                    data: performanceData.map(item => item.total_tarefas),
                                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                                    borderColor: "rgba(255, 99, 132, 1)",
                                    borderWidth: 2,
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Performance dos Colaboradores"
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                </MainWorker_Count>
            )}

            {workloadData && workloadData.length > 0 && (
                <MainWorker_Count>
                    <Bar
                        data={{
                            labels: workloadData.map(item => item.nm_Colaborador),
                            datasets: [
                                {
                                    label: "Aguardando",
                                    data: workloadData.map(item => item.tarefas_aguardando),
                                    backgroundColor: "rgba(255, 205, 86, 0.6)",
                                },
                                {
                                    label: "Em Andamento",
                                    data: workloadData.map(item => item.tarefas_em_andamento),
                                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                                },
                                {
                                    label: "Concluídas",
                                    data: workloadData.map(item => item.tarefas_concluidas),
                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Distribuição de Carga de Trabalho por Colaborador"
                                }
                            },
                            scales: {
                                x: {
                                    stacked: true,
                                },
                                y: {
                                    stacked: true,
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                </MainWorker_Count>
            )}

            {deadlineData && deadlineData.length > 0 && (
                <Info_Container>
                    <CountProcesses>
                        <Doughnut
                            data={{
                                labels: deadlineData.map(item => item.status_prazo),
                                datasets: [
                                    {
                                        label: "Status dos Prazos",
                                        data: deadlineData.map(item => item.quantidade),
                                        backgroundColor: [
                                            "rgba(255, 99, 132, 0.8)",   // Atrasadas - Vermelho
                                            "rgba(255, 205, 86, 0.8)",  // Próximas do Vencimento - Amarelo
                                            "rgba(75, 192, 192, 0.8)",  // No Prazo - Verde
                                            "rgba(54, 162, 235, 0.8)",  // Concluídas - Azul
                                            "rgba(153, 102, 255, 0.8)"  // Outras - Roxo
                                        ],
                                        borderColor: [
                                            "rgb(255, 99, 132)",
                                            "rgb(255, 205, 86)",
                                            "rgb(75, 192, 192)",
                                            "rgb(54, 162, 235)",
                                            "rgb(153, 102, 255)"
                                        ],
                                        borderWidth: 2,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: "top" },
                                    title: {
                                        display: true,
                                        text: "Análise de Prazos das Tarefas"
                                    }
                                }
                            }}
                        />
                    </CountProcesses>
                    <CountProcesses>
                        <Bar
                            data={{
                                labels: taskTypeData ? taskTypeData.map(item => item.nm_TipoTarefa.length > 20 ? item.nm_TipoTarefa.substring(0, 20) + "..." : item.nm_TipoTarefa) : [],
                                datasets: [
                                    {
                                        label: "Quantidade",
                                        data: taskTypeData ? taskTypeData.map(item => item.quantidade) : [],
                                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                                        borderColor: "rgba(54, 162, 235, 1)",
                                        borderWidth: 1,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: "top" },
                                    title: {
                                        display: true,
                                        text: "Top 10 Tipos de Tarefas Mais Comuns"
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}
                        />
                    </CountProcesses>
                </Info_Container>
            )}

            {processValueData && processValueData.length > 0 && (
                <MainWorker_Count>
                    <Bar
                        data={{
                            labels: processValueData.map(item => `${item.sg_Tribunal} - ${item.nm_FaseProcesso}`),
                            datasets: [
                                {
                                    label: "Valor Total (R$)",
                                    data: processValueData.map(item => item.valor_total),
                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                    borderColor: "rgba(75, 192, 192, 1)",
                                    borderWidth: 2,
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Valor dos Processos por Tribunal e Fase"
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return 'R$ ' + value.toLocaleString('pt-BR');
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </MainWorker_Count>
            )}

            {efficiencyTrendsData && efficiencyTrendsData.length > 0 && (
                <MainWorker_Count>
                    <Line
                        data={{
                            labels: efficiencyTrendsData.map(item => {
                                const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
                                return `${meses[item.mes - 1]}/${item.ano}`
                            }),
                            datasets: [
                                {
                                    label: "Taxa de Conclusão (%)",
                                    data: efficiencyTrendsData.map(item => item.taxa_conclusao),
                                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                                    borderColor: "rgba(75, 192, 192, 1)",
                                    borderWidth: 3,
                                    fill: true,
                                    tension: 0.4,
                                    yAxisID: 'y'
                                },
                                {
                                    label: "Total de Tarefas",
                                    data: efficiencyTrendsData.map(item => item.total_tarefas),
                                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                                    borderColor: "rgba(54, 162, 235, 1)",
                                    borderWidth: 3,
                                    fill: false,
                                    tension: 0.4,
                                    yAxisID: 'y1'
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: "Tendências de Eficiência ao Longo do Tempo"
                                }
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    display: true,
                                    position: 'left',
                                    title: {
                                        display: true,
                                        text: 'Taxa de Conclusão (%)'
                                    },
                                    min: 0,
                                    max: 100
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'Total de Tarefas'
                                    },
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                }
                            }
                        }}
                    />
                </MainWorker_Count>
            )}
        </div>
    )
}