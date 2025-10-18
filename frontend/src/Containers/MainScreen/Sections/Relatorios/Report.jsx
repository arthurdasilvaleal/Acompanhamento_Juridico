import { Download_Button, Container, FilterBox, Charge_bar, StyledSelect } from "./style.jsx"
import { useState, useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import axios from "axios"
import { DocumentArrowDownIcon, ChartBarIcon, UserGroupIcon, DocumentTextIcon } from "@heroicons/react/24/outline"

export default function Report(){

    // Variáveis dos filtros
    const [FirstSelect, set_FirstSelect] = useState("")
    const [SecondSelect, set_SecondSelect] = useState("")
    const [selectedClient, set_SelectedClient] = useState(null)
    const [selectedWorker, set_SelectedWorker] = useState(null)
    const [selectedProcess, set_SelectedProcess] = useState(null)

    // Variáveis de estado
    const [FilterStatus, set_FilterStatus] = useState("")
    const [ClientInfo, set_ClientInfo] = useState([])
    const [ProcessInfo, set_ProcessInfo] = useState([])
    const [WorkerInfo, set_WorkerInfo] = useState([])

    // Função de envio
    const handleSubmit = async () => {
        
        const filterData = {
            FilterOne: parseInt(FirstSelect),
            FilterTwo: parseInt(SecondSelect),
            FilterThree: (() => {
              if (FirstSelect === "2") {
                return ClientInfo.find(c => c.cd_Cliente === selectedClient)?.nm_Cliente || ""
              }
              if (FirstSelect === "1") {
                if (SecondSelect === "3") {
                  // 🔥 Processo -> Cliente específico
                  return ClientInfo.find(c => c.cd_Cliente === selectedClient)?.nm_Cliente || ""
                }
                if (SecondSelect === "4") {
                  // Processo -> Processo específico
                  return ProcessInfo.find(p => p.cd_Processo === selectedProcess)?.cd_NumeroProcesso || ""
                }
                return "" // Processo -> Todos
              }
              if (FirstSelect === "3") {
                return WorkerInfo.find(w => w.cd_Colaborador === selectedWorker)?.nm_Colaborador || ""
              }
              return ""
            })()
          }

        console.log(filterData)

        try {
            const response = await axios.post("http://localhost:5000/generate_pdf", filterData, {
                responseType: 'blob'
            })

            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
            link.setAttribute("download", "Relatorio.pdf")
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.log("Erro ao gerar PDF:", error)
        }
    }

    // Pegar dados do banco
    useEffect(() => {
        if(SecondSelect === "3" && ClientInfo.length === 0){
            (async() => {
                try {
                    const response = await axios.get("http://localhost:5000/get_clientes")
                    set_ClientInfo(response.data)
                } catch(error){
                    console.log("Erro ao buscar clientes.", error)
                }
            })()
        }

        if(SecondSelect === "4" && ProcessInfo.length === 0){
            (async() => {
                try {
                    const response = await axios.get("http://localhost:5000/get_processos?only=id")
                    set_ProcessInfo(response.data)
                } catch(error){
                    console.log("Erro ao buscar processos.", error)
                }
            })()
        }

        if(SecondSelect === "5" && WorkerInfo.length === 0){
            (async() => {
                try {
                    const response = await axios.get("http://localhost:5000/get_colaborador")
                    set_WorkerInfo(response.data)
                } catch(error){
                    console.log("Erro ao buscar colaboradores.", error)
                }
            })()
        }
    }, [SecondSelect])

    // Options
    const ClientOptions = useMemo(() => ClientInfo.map(client => ({
        value: client.cd_Cliente,
        label: client.nm_Cliente
    })), [ClientInfo])

    const ProcessOptions = useMemo(() => ProcessInfo.map(process => ({
        value: process.cd_Processo,
        label: process.cd_NumeroProcesso
    })), [ProcessInfo])

    const WorkerOptions = useMemo(() => WorkerInfo.map(worker => ({
        value: worker.cd_Colaborador,
        label: worker.nm_Colaborador
    })), [WorkerInfo])

    return (
        <Container>
            {/* Filtro um */}
            <FilterBox className="filter-one">
                <div className="input-group-select">
                    <label>Selecione o bloco que deseja exportar</label>
                    <select 
                        value={FirstSelect}
                        onChange={(e) => {
                            const value = e.target.value
                            set_FirstSelect(value)
                            set_SecondSelect("") 
                            set_SelectedClient(null)
                            set_SelectedProcess(null)
                            set_SelectedWorker(null)
                            set_FilterStatus(value !== "" ? 3 : 0)
                        }}
                        required
                    >
                        {FirstSelect === "" && ( 
                            <option value="">Selecione</option>
                        )}
                        <option value="1">Processos</option>
                        <option value="2">Clientes</option>
                        <option value="3">Colaboradores</option>
                    </select>
                </div>
            </FilterBox>

            <AnimatePresence mode="popLayout">
                {/* Filtro dois */}
                {FirstSelect === "2" ? (
                    <motion.div
                        key="clients-filter"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FilterBox className="clients-filter">
                            <div className="input-group-select">
                                <label>Selecione o tipo de dados de clientes</label>
                                <select 
                                    value={SecondSelect}
                                    onChange={(e) => {
                                        const filterInput = e.target.value
                                        set_SecondSelect(filterInput)
                                        set_SelectedClient(null) // 🔥 reset
                                        set_FilterStatus(filterInput === "3" ? 4 : filterInput === "1" ? 5 : 3)
                                    }} 
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="1">Todos</option>
                                    <option value="3">Cliente específico</option>
                                </select>
                            </div>
                        </FilterBox>
                    </motion.div>
                ) : FirstSelect === "1" ? (
                    <motion.div
                        key="process-filter"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FilterBox className="process-filter">
                            <div className="input-group-select">
                                <label>Selecione o tipo de dados de processos</label>
                                <select 
                                    value={SecondSelect}
                                    onChange={(e) => {
                                        const filterInput = e.target.value
                                        set_SecondSelect(filterInput)
                                        set_SelectedProcess(null) // 🔥 reset
                                        set_FilterStatus(filterInput === "3" ? 4 : filterInput === "4" ? 4 : filterInput === "1" ? 5 : 3)
                                    }}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="1">Todos</option>
                                    <option value="3">Cliente específico</option>
                                    <option value="4">Processo Específico</option>
                                </select>
                            </div>
                        </FilterBox>
                    </motion.div>
                ) : FirstSelect === "3" && (
                    <motion.div
                        key="worker-filter"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FilterBox className="worker-filter">
                            <div className="input-group-select">
                                <label>Selecione o tipo de dados de colaboradores</label>
                                <select 
                                    value={SecondSelect}
                                    onChange={(e) => {
                                        const filterInput = e.target.value
                                        set_SecondSelect(filterInput)
                                        set_SelectedWorker(null) // 🔥 reset
                                        set_FilterStatus(filterInput === "5" ? 4 : filterInput === "1" ? 5 : 3)
                                    }} 
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="1">Todos</option>
                                    <option value="5">Colaborador específico</option>
                                </select>
                            </div>
                        </FilterBox>
                    </motion.div>
                )}

                {/* Terceiro filtro */}
                {SecondSelect === "3" && (
                    <motion.div key="client-picker" layout {...anim}>
                        <FilterBox className="client-picker">
                            <StyledSelect
                                options={ClientOptions}
                                value={ClientOptions.find(option => option.value === selectedClient) || null}
                                onChange={(selectedOption) => {
                                    set_SelectedClient(selectedOption ? selectedOption.value : null)
                                    set_FilterStatus(selectedOption ? 5 : 4)
                                }}
                                placeholder="Nome do cliente..."
                                isClearable
                                classNamePrefix="react-select"
                            />
                        </FilterBox>
                    </motion.div>
                )}
                {SecondSelect === "4" && (
                    <motion.div key="process-picker" layout {...anim}>
                        <FilterBox className="process-picker">
                            <StyledSelect
                                options={ProcessOptions}
                                value={ProcessOptions.find(option => option.value === selectedProcess) || null}
                                onChange={(selectedOption) => {
                                    set_SelectedProcess(selectedOption ? selectedOption.value : null)
                                    set_FilterStatus(selectedOption ? 5 : 4)
                                }}
                                placeholder="Nº Processo..."
                                isClearable
                                classNamePrefix="react-select"
                            />
                        </FilterBox>
                    </motion.div>
                )}
                {SecondSelect === "5" && (
                    <motion.div key="worker-picker" layout {...anim}>
                        <FilterBox className="worker-picker">
                            <StyledSelect
                                options={WorkerOptions}
                                value={WorkerOptions.find(option => option.value === selectedWorker) || null}
                                onChange={(selectedOption) => {
                                    set_SelectedWorker(selectedOption ? selectedOption.value : null)
                                    set_FilterStatus(selectedOption ? 5 : 4)
                                }}
                                placeholder="Nome do colaborador..."
                                isClearable
                                classNamePrefix="react-select"
                            />
                        </FilterBox>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botão de download */}
            <motion.div layout key="charge-bar">
                <Charge_bar $Status={FilterStatus}>
                    <AnimatePresence mode="popLayout">
                        {FilterStatus === 5 && (
                            <motion.div
                                style={{ display: "flex", alignItems: "center", flexDirection: "column"}}
                                key="Download"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p style={{ textAlign: 'center' }}>Seu download está pronto!</p>
                                <Download_Button className="Download" onClick={handleSubmit}>
                                    Gerar PDF
                                </Download_Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Charge_bar>
            </motion.div>

            {/* Seção de informações e estatísticas */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="info-section"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ 
                        duration: 0.6, 
                        delay: 0.2,
                        ease: "easeOut"
                    }}
                    layout
                    style={{
                        marginTop: "40px",
                        padding: "30px",
                        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                        borderRadius: "16px",
                        border: "1px solid #333",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                    }}
                >
                <motion.div 
                    layout
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "30px",
                        marginBottom: "30px"
                    }}
                >
                    {/* Card de Informações do Relatório */}
                    <motion.div
                        key="report-info-card"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.3,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        layout
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            padding: "25px",
                            borderRadius: "12px",
                            color: "white",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                        }}
                    >
                        <DocumentTextIcon style={{ width: "40px", height: "40px", margin: "0 auto 15px" }} />
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Relatório Personalizado</h3>
                        <p style={{ margin: "0", opacity: 0.9, fontSize: "14px" }}>
                            {FirstSelect === "1" ? "Dados de Processos" : 
                             FirstSelect === "2" ? "Dados de Clientes" : 
                             FirstSelect === "3" ? "Dados de Colaboradores" : "Selecione um tipo"}
                        </p>
                    </motion.div>

                    {/* Card de Filtros Aplicados */}
                    <motion.div
                        key="filters-card"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.4,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        layout
                        style={{
                            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            padding: "25px",
                            borderRadius: "12px",
                            color: "white",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(240, 147, 251, 0.3)"
                        }}
                    >
                        <ChartBarIcon style={{ width: "40px", height: "40px", margin: "0 auto 15px" }} />
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Filtros Aplicados</h3>
                        <p style={{ margin: "0", opacity: 0.9, fontSize: "14px" }}>
                            {SecondSelect === "1" ? "Todos os registros" :
                             SecondSelect === "3" ? "Cliente específico" :
                             SecondSelect === "4" ? "Processo específico" :
                             SecondSelect === "5" ? "Colaborador específico" : "Nenhum filtro"}
                        </p>
                    </motion.div>

                    {/* Card de Estatísticas */}
                    <motion.div
                        key="stats-card"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: 0.5,
                            ease: "easeOut"
                        }}
                        whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                        }}
                        layout
                        style={{
                            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                            padding: "25px",
                            borderRadius: "12px",
                            color: "white",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)"
                        }}
                    >
                        <UserGroupIcon style={{ width: "40px", height: "40px", margin: "0 auto 15px" }} />
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Dados Disponíveis</h3>
                        <p style={{ margin: "0", opacity: 0.9, fontSize: "14px" }}>
                            {ClientInfo.length > 0 && `Clientes: ${ClientInfo.length}`}
                            {ProcessInfo.length > 0 && ` | Processos: ${ProcessInfo.length}`}
                            {WorkerInfo.length > 0 && ` | Colaboradores: ${WorkerInfo.length}`}
                            {ClientInfo.length === 0 && ProcessInfo.length === 0 && WorkerInfo.length === 0 && "Carregando dados..."}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Seção de Dicas */}
                <motion.div
                    key="tips-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                        duration: 0.6, 
                        delay: 0.8,
                        ease: "easeOut"
                    }}
                    layout
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)"
                    }}
                >
                    <h4 style={{ 
                        margin: "0 0 15px 0", 
                        color: "#CDAF6F", 
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <DocumentArrowDownIcon style={{ width: "20px", height: "20px" }} />
                        Dicas para Relatórios
                    </h4>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "15px"
                    }}>
                        <div style={{ fontSize: "14px", opacity: 0.8 }}>
                            <strong>📊 Processos:</strong> Inclui dados completos de processos, intimações e tarefas
                        </div>
                        <div style={{ fontSize: "14px", opacity: 0.8 }}>
                            <strong>👥 Clientes:</strong> Informações de contato e processos vinculados
                        </div>
                        <div style={{ fontSize: "14px", opacity: 0.8 }}>
                            <strong>👨‍💼 Colaboradores:</strong> Dados de performance e tarefas atribuídas
                        </div>
                    </div>
                </motion.div>
                </motion.div>
            </AnimatePresence>
        </Container>
    )
}

// Props do motion
const anim = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}