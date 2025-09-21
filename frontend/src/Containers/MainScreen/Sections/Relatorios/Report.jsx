import { Download_Button, Container, FilterBox, Charge_bar } from "./style.jsx"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import axios from "axios"
import { option } from "framer-motion/client"

export default function Report(){

    // Variáveis dos filtros
    const [FirstSelect, set_FirstSelect] = useState("")
    const [SecondSelect, set_SecondSelect] = useState("")
    const [ThirdSelect, set_ThirdSelect] = useState("")

    // Variáveis de estado
    const [FilterStatus, set_FilterStatus] = useState("") // Barra de progresso ao continuar com os filtros
    const [ClientInfo, set_ClientInfo] = useState([])
    const [ProcessInfo, set_ProcessInfo] = useState([])
    const [WorkerInfo, set_WorkerInfo] = useState([])


    // Extrair os dados do banco 
    const handleSubmit = async () => {

        // 1 = "Processos"
        // 2 = "Clientes"
        // 3 = "Colaboradores"

        const filterData = {
            FilterOne: parseInt(FirstSelect),
            FilterTwo: parseInt(SecondSelect),
            FilterThree: ThirdSelect
        }

        console.log(filterData)

        try{
            const response = await axios.post("http://localhost:5000/generate_pdf", filterData, {
                responseType: 'blob'
            })

            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
            link.setAttribute("download", "Relatorio.pdf")
            document.body.appendChild(link)
            link.click()
            link.remove()
            console.log(response)

        }catch (error){
            console.log("Erro ao gerar PDF:", error)
        }
    }

    // Pegar os nomes e códigos de clientes
    useEffect(() => {

        if(SecondSelect === "3" && ClientInfo.length === 0){
            (async() => {
                try{
                    const response = await axios.get("http://localhost:5000/get_clientes")
                    set_ClientInfo(response.data)
                    // console.log(response)
                }catch(error){
                    console.log("Erro ao buscar clientes.", error)
                }
                
            })()
        }
        
        if(SecondSelect === "4" && ProcessInfo.length === 0){
            (async() => {
                try{
                    const response = await axios.get("http://localhost:5000/get_processos?only=id")
                    set_ProcessInfo(response.data)
                    // console.log(response)
                }catch(error){
                    console.log("Erro ao buscar Processos.", error)
                }
                
            })()
        }

        if(SecondSelect === "5" && WorkerInfo.length === 0){
            (async() => {
                try{
                    const response = await axios.get("http://localhost:5000/get_colaborador")
                    set_WorkerInfo(response.data)
                    console.log(response)
                }catch(error){
                    console.log("Erro ao buscar Colaboradores.", error)
                }
                
            })()
        }
    }, [SecondSelect])

    return(
        <Container>
            {/* Filtro um: Escolhendo o bloco de dados */}
            <FilterBox className="filter-one">
                <div className="input-group-select">
                    <label>Selecione o bloco que deseja exportar</label>
                    <select name="Filter" id="" onChange={(e) => {
                        set_FirstSelect(e.target.value)
                        set_FilterStatus(e.target.value !== "" ? 3 : 0)
                        set_SecondSelect(e.target.value === "" && "")
                        }} value={FirstSelect} required>
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
                {/* Filtro dois: Fazendo a filtragem dos dados do bloco escolhido */}
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
                                <label>Selecione o tipos de dados de clientes</label>
                                <select name="Filter" id="" onChange={(e) => {
                                    const filterInput = e.target.value
                                    set_SecondSelect(filterInput)
                                    set_FilterStatus(filterInput === "2" ? 2 : filterInput === "3" ? 4 : filterInput === "1" ? 5 : 1)
                                    }} required>
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
                                <label>Selecione o tipos de dados de processos</label>
                                <select name="Filter" id="" onChange={(e) => {
                                    set_SecondSelect(e.target.value)
                                    set_FilterStatus(e.target.value === "3" ? 4 : e.target.value === "4" ? 4 : e.target.value === "1" ? 5 : 1)
                                    }} required>
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
                    key="client-filter"
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    >
                        <FilterBox className="client-filter">
                            <div className="input-group-select">
                                <label>Selecione o tipos de dados de colaboradores</label>
                                <select name="Filter" id="" onChange={(e) => {
                                    set_SecondSelect(e.target.value)
                                    set_FilterStatus(e.target.value === "5" ? 4 : e.target.value === "1" ? 5 : 1)
                                    }} required>
                                    <option value="">Selecione</option>
                                    <option value="1">Todos</option>
                                    <option value="5">Colaborador específico</option>
                                </select>
                            </div>
                        </FilterBox>
                    </motion.div>
                )}
                {/* Terciro Filtro: Apenas CLientes selecionados */}
                {SecondSelect === "3" ? (
                    <motion.div
                    key="client-picker"
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    >
                        <FilterBox className="client-picker">
                            <div className="input-group-select">
                                <label>Cliente</label>
                                <select name="Filter" id="" onChange={(e) => {
                                    const filterInput = e.target.value
                                    set_ThirdSelect(filterInput)
                                    set_FilterStatus(filterInput === "" ? 4 : 5)
                                    }} required>
                                    <option value="">Selecione</option>
                                    {ClientInfo.map((client) => {
                                        return(
                                            <option key={client.cd_Cliente}>{client.nm_Cliente}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </FilterBox>
                    </motion.div>
                ) : SecondSelect === "4" ? (
                    <motion.div
                    key="Processo-picker"
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    >
                        <FilterBox className="Processo-picker">
                            <div className="input-group-select">
                                <label>Processo</label>
                                <select name="Filter" id="" onChange={(e) => {
                                    const filterInput = e.target.value
                                    set_ThirdSelect(filterInput)
                                    set_FilterStatus(filterInput === '' ? 4 : 5)
                                    }} required>
                                    <option value="">Selecione</option>
                                    {ProcessInfo.map((process) => {
                                        return(
                                            <option key={process.cd_Processo}>{process.cd_NumeroProcesso}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </FilterBox>
                    </motion.div>
                ) : SecondSelect === "5" && (
                    <motion.div
                    key="Worker-picker"
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    >
                        <FilterBox className="Worker-picker">
                            <div className="input-group-select">
                                <label>Colaborador</label>
                                <select name="Filter" id="" onChange={(e) => {
                                    const filterInput = e.target.value
                                    set_ThirdSelect(filterInput)
                                    set_FilterStatus(filterInput === '' ? 4 : 5)
                                    }} required>
                                    <option value="">Selecione</option>
                                    {WorkerInfo.map((worker) => {
                                        return(
                                            <option key={worker.cd_Colaborador}>{worker.nm_Colaborador}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </FilterBox>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div layout key="charge-bar"> {/* Para animar mudança do charge bar conforme a mudança do layout */}
                <Charge_bar $Status={FilterStatus}>
                    <AnimatePresence mode="popLayout">
                        {FilterStatus === 5 && (
                        <div className="charge-bar">
                            <motion.div
                                style={{ display: "flex", alignItems: "center", flexDirection: "column"}}
                                key="Download"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                >
                                    <p>Seu download esta pronto!</p>
                                    <Download_Button className="Download" onClick={() => handleSubmit()}>Gerar pdf</Download_Button>
                            </motion.div>
                        </div>
                        )}
                    </AnimatePresence>
                </Charge_bar>
            </motion.div>
        </Container>
    )
}