// ===================================================================
// ALTERAÇÃO 1: Importar o componente Select e o useMemo
// ===================================================================
import { Process_Form, Process_button, FixedBox, Process_back_button } from "./style"
import { useEffect, useState, useMemo } from "react"
import Select from 'react-select'; // <-- ADICIONADO
import { NumericFormat } from 'react-number-format'
import Modal from '../../../../../components/Modal/Modal'
import Loading_Form from "../../../../../components/Loading_Form/Loading"
import axios from "axios"

// ===================================================================
// ALTERAÇÃO 2: Adicionar os estilos customizados para o Select
// (Coloquei fora do componente para não ser recriado a cada renderização)
// ===================================================================
const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#00000039', // Cor de fundo do input (ajuste se necessário)
        minHeight: '48px',
        width: 'calc(30vw + 36px)',
        borderColor: state.isFocused ? '#CDAF6F' : 'transparent', // Cor da borda
        borderRadius: '8px',
        
        boxShadow: state.isFocused ? '0 0 0 1px #CDAF6F' : 'none',
        '&:hover': {
            borderColor: '#CDAF6F',
        },
    }),
    input: (provided) => ({
        ...provided,
        color: '#ffffff', // Cor do texto digitado
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffffff', // Cor do valor selecionado
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#3a3a4a', // Cor de fundo do dropdown
        borderRadius: '8px',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#4f4f6a' : 'transparent', // Cor da opção com hover
        color: '#e0e0e0',
        '&:active': {
            backgroundColor: '#7f5ad5',
        }
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#a0a0a0', // Cor do placeholder
    }),
};


export default function Processo({ ShowWindow, setShowWindow, ShowEditWindow, setShowEditWindow, editInfo, setAddedProcess, setEditedProcess }){

    // Variáveis de input/Recebimento de dados
    const [cd_NumProcesso, set_NumProcesso] = useState("")
    const [nm_Cliente, set_nmCliente] = useState("")
    const [cd_Cliente, set_cdCliente] = useState(null)
    const [ListCliente, set_ListCliente] = useState([])
    const [opcaoCliente, set_OpacaoCliente] = useState("")
    const [nm_Autor, set_Autor] = useState("")
    const [nm_Reu, set_Reu] = useState("")
    const [nm_Cidade, set_Cidade] = useState("")
    const [vl_Causa, set_Causa] = useState("")
    const [ds_Juizo, set_Juizo] = useState("")
    const [ds_Acao, set_Acao] = useState("")
    const [sg_Tribunal, set_Tribunal] = useState("")
    const [cd_FaseProcesso, set_FaseProcesso] = useState("1")

    // Variáveis de estado
    const isSelectable = nm_Cliente === ""
    const blockCamp = opcaoCliente
    const [Loading, set_Loading] = useState(false)
    const [firstEditRender, set_firstEditRender] = useState(false)

    // Variáveis do Modal
    const [isModalOpen, set_ModalOpen] = useState(false)
    const [formStatusMessage, set_FormStatusMessage] = useState("")
    const [fromStatusErrorMessage, set_fromStatusErrorMessage] = useState("")
    const [deleteMessage, set_deleteMessage] = useState(false)

    // ===================================================================
    // ALTERAÇÃO 3: Transformar sua lista de clientes para o formato que o react-select espera
    // useMemo otimiza a performance, evitando que a lista seja recriada a cada renderização
    // ===================================================================
    const clienteOptions = useMemo(() => ListCliente.map(cliente => ({
        value: cliente.cd_Cliente,
        label: cliente.nm_Cliente
    })), [ListCliente]);

    const handleSubmit = async (e) => {
        e.preventDefault()

        set_Loading(true)
        const parsedValueCause = vl_Causa.replace(/[^0-9,]/g, "").replace(",", ".")

        const post_processo = {
            cd_NumProcesso,
            nm_Cliente,
            opcaoCliente,
            nm_Autor,
            nm_Reu,
            nm_Cidade,
            vl_Causa: parsedValueCause,
            ds_Juizo,
            ds_Acao,
            sg_Tribunal
        }

        if(ShowWindow){
            try{
                const response = await axios.post("http://localhost:5000/post_processo", post_processo)
                console.log("Processo adicionado com sucesso:", response.data)
                set_FormStatusMessage("Processo adicionado com sucesso!")
                set_ModalOpen(true)
                set_fromStatusErrorMessage("")
                set_Loading(false)

                set_NumProcesso("")
                set_nmCliente("")
                set_OpacaoCliente("")
                set_Autor("")
                set_Reu("")
                set_Cidade("")
                set_Causa("")
                set_Juizo("")
                set_Acao("")
                set_Tribunal("")

                setAddedProcess(true)
                
            } catch (error) {
                console.error("Erro ao adicionar processo:", error)
                set_FormStatusMessage("Erro ao Adicionar Processo.")
                set_fromStatusErrorMessage(error.response.data.error)
                set_ModalOpen(true)
                set_Loading(false)
            }
        } else if(ShowEditWindow){

            const put_processo = {
                cd_Processo: editInfo.cdProcesso,
                cd_NumProcesso,
                nm_Cliente,
                cd_ClienteNovo: cd_Cliente,
                cd_ClienteAntigo: editInfo.cdCliente,
                opcaoCliente,
                nm_Autor,
                nm_Reu,
                nm_Cidade,
                vl_Causa: parsedValueCause,
                ds_Juizo,
                ds_Acao,
                sg_Tribunal,
                cd_FaseProcesso
            }

            try{
                const response = await axios.put("http://localhost:5000/put_processo", put_processo)
                console.log("Processo editado com sucesso:", response.data)
                set_FormStatusMessage("Processo editado com sucesso!")
                set_ModalOpen(true)
                set_fromStatusErrorMessage("")
                set_Loading(false)

                setEditedProcess(true)
                setShowEditWindow(false)

                set_NumProcesso("")
                set_nmCliente("")
                set_OpacaoCliente("")
                set_Autor("")
                set_Reu("")
                set_Cidade("")
                set_Causa("")
                set_Juizo("")
                set_Acao("")
                set_Tribunal("")
                set_FaseProcesso("1")
                
            } catch (error) {
                console.error("Erro ao editar processo:", error)
                set_FormStatusMessage("Erro ao editar Processo.")
                set_fromStatusErrorMessage(error.response.data.error ===
                        "1048 (23000): Column 'cd_Cliente' cannot be null" ? 
                        "Cliente novo não encontrado" : error.response.data.error)
                set_ModalOpen(true)
                set_Loading(false)
                
                setShowEditWindow(false)
            }
        }
    }

    // Pegando o nome dos clientes no banco
    useEffect(() => {
        if(ShowWindow || ShowEditWindow){
            axios.get("http://localhost:5000/get_clientes")
            .then(response => {
                set_ListCliente(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.error("Erro ao buscar clientes:", error)
            })
        }
    }, [ShowWindow, ShowEditWindow])

    // Atribuindo o valor de reu ou autor automaticamente dependendo do usuario
    useEffect(() => {
        if(firstEditRender || ShowWindow){
            if (blockCamp === "1") {set_Reu(nm_Cliente)} 
            else if (blockCamp === "2") {set_Autor(nm_Cliente)}
        }
        if(ShowEditWindow) set_firstEditRender(true)
    }, [blockCamp, nm_Cliente])
        
    // Quando editar um processo, as informações são preenchidas nos inputs, porém resetadas ao adicionar
    useEffect(() => {
        if(ShowWindow){
            set_NumProcesso("")
            set_nmCliente("")
            set_OpacaoCliente("")
            set_Autor("")
            set_Reu("")
            set_Cidade("")
            set_Causa("")
            set_Juizo("")
            set_Acao("")
            set_Tribunal("")
        }
        else if(ShowEditWindow){
            set_NumProcesso(editInfo.cdNumeroProcesso)
            set_nmCliente(editInfo.nmCliente)
            set_OpacaoCliente(() => editInfo.nmCliente == editInfo.nmAutor
                ? "2" : editInfo.nmCliente == editInfo.nmReu ? "1" : "3")
            set_cdCliente(editInfo.cdCliente)
            set_Autor(editInfo.nmAutor)
            set_Reu(editInfo.nmReu)
            set_Cidade(editInfo.nmCidade)
            set_Causa(editInfo.vlCausa)
            set_Juizo(editInfo.dsJuizo)
            set_Acao(editInfo.dsAcao)
            set_Tribunal(editInfo.sgTribunal)
            set_FaseProcesso(editInfo.cdFaseProcesso)
        }
    }, [ShowEditWindow, ShowWindow])

    // Pega o cliente. Se o Nome do cliente for igual aos dados da API, é atribuido o código
    useEffect(() => {
        if(!nm_Cliente || ListCliente.length === 0) {
            set_cdCliente(null) // Garante que o cd_Cliente seja nulo se o nome for limpo
            return
        }
        
        const finded = ListCliente.find((pessoa) => 
            pessoa.nm_Cliente.toLowerCase() === nm_Cliente.toLowerCase()
        )

        if(finded){
            set_cdCliente(finded.cd_Cliente)
        } else {
            set_cdCliente(null)
        }

    }, [nm_Cliente, ListCliente])


    return(
        <FixedBox $Show={ShowWindow} $ShowEdit={ShowEditWindow}>
            {Loading && (<Loading_Form setDOM={true}/>)}
            <Process_back_button onClick={() => {
                    if(!ShowEditWindow){
                        setShowWindow(false)
                        window.scrollTo({
                            top: 1,
                            behavior: "smooth"
                        })
                        document.body.style.overflow = "hidden"
                    }else{
                        setShowEditWindow(false)
                        set_firstEditRender(false)
                    }
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                </svg>
                <span>Voltar</span>
            </Process_back_button>
            
            <h1>{ShowEditWindow ? "Editar um processo" : "Adicionar um processo"}</h1>
            <hr />
            <Process_Form onSubmit={handleSubmit} $clientSelect={isSelectable}>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Processo">Número do Processo</label>
                    <input onChange={(e) => {
                        const ParsedInteger = e.target.value.replace(/[^0-9-.]/g, "")
                        set_NumProcesso(ParsedInteger)}} autoComplete="off" name="nm_Processo" id="nm_Processo" className="input" type="text" value={cd_NumProcesso} maxLength={25} required/>
                </div>
                {/* =================================================================== */}
                {/* ALTERAÇÃO 4: Substituir o input e datalist pelo componente Select */}
                {/* =================================================================== */}
                <div className="input-group">
                    <label className="label" htmlFor="nm_Cliente">Nome do Cliente</label>
                    <Select
                        id="nm_Cliente"
                        name="nm_Cliente"
                        options={clienteOptions}
                        styles={customSelectStyles}
                        // O 'value' agora precisa ser o objeto completo da opção, não apenas o texto
                        value={clienteOptions.find(option => option.label === nm_Cliente) || null}
                        // O 'onChange' retorna o objeto selecionado. Pegamos o 'label' para o seu estado 'nm_Cliente'
                        onChange={(selectedOption) => {
                            set_nmCliente(selectedOption ? selectedOption.label : "");
                        }}
                        placeholder="Digite ou selecione um cliente..."
                        noOptionsMessage={() => "Nenhum cliente encontrado"}
                        isClearable // Permite que o usuário limpe o campo
                        required
                    />
                </div>
                {/* FIM DA ALTERAÇÃO */}
                
                <div className="input-group-select-mid">
                    <label className="label" htmlFor="opcaoCliente">Selecione a posição desse cliente</label>
                    <select onChange={(e) => {set_OpacaoCliente(e.target.value)}} name="opcaoCliente" id="opcaoCliente" className="input-select" value={opcaoCliente} required>
                        <option value="">Selecione</option>
                        <option value="1">Réu</option>
                        <option value="2">Autor</option>
                        <option value="3">Terceiro</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Autor">Nome do Autor</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Autor(ParsedString)}} autoComplete="off" name="nm_Autor" id="nm_Autor" className="input" type="text" value={nm_Autor} disabled={blockCamp === '2'} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="nm_Reu">Nome do Réu</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Reu(ParsedString)}} autoComplete="off" name="nm_Reu" id="nm_Reu" className="input" type="text" value={nm_Reu} disabled={blockCamp === '1'} required/>
                </div>
                <div className="input-group">
                <label className="label" htmlFor="nm_Cidade">Cidade</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
                        set_Cidade(ParsedString)}} autoComplete="off" name="nm_Cidade" id="nm_Cidade" className="input" type="text" value={nm_Cidade} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="vl_Causa">Valor da Causa</label>
                    <NumericFormat thousandSeparator="." decimalSeparator="," decimalScale={2} fixedDecimalScale prefix="R$ "
                        allowNegative={false} onChange={(e) => set_Causa(e.target.value)} maxLength={16}
                        autoComplete="off" name="vl_Causa" id="vl_Causa" className="input" type="text" value={vl_Causa} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="ds_Juizo">Descrição do Juízo</label>
                    <input onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ,.0-9°ºª\s]/g, "")
                        set_Juizo(ParsedString)}} autoComplete="off" name="ds_Juizo" id="ds_Juizo" className="input" type="text" value={ds_Juizo} maxLength={30} required/>
                </div>
                <div className="input-group">
                    <label className="label" htmlFor="ds_Acao">Descrição da Ação</label>
                    <textarea onChange={(e) => {
                        const ParsedString = e.target.value.replace(/[^a-zA-ZÀ-ÿ,.0-9ºª°\s]/g, "")
                        set_Acao(ParsedString)}} autoComplete="off" name="ds_Acao" id="ds_Acao" className="input" type="text" value={ds_Acao} maxLength={50} required/>
                </div>
                <div className="input-group-select">
                    <label className="label" htmlFor="sg_Tribunal">Tribunal</label>
                    <select onChange={(e) => set_Tribunal(e.target.value)} name="sg_Tribunal" id="sg_Tribunal" className="input-select" value={sg_Tribunal} required>
                        <option value="">Selecione</option>
                        <option value="TJSP">TJSP</option>
                        <option value="TRT2">TRT2</option>
                        <option value="TRF3">TRF3</option>
                        <option value="TST">TST</option>
                        <option value="STJ">STJ</option>
                        <option value="STF">STF</option>
                    </select>
                </div>
                {ShowEditWindow && (
                    <div className="input-group-select">
                        <label className="label" htmlFor="cd_FaseProcesso">Fase</label>
                        <select onChange={(e) => set_FaseProcesso(e.target.value)} name="cd_FaseProcesso" id="cd_FaseProcesso" className="input-select" value={cd_FaseProcesso} required>
                            <option value="1">Conhecimento</option>
                            <option value="2">Recursal</option>
                            <option value="3">Execução</option>
                            <option value="4">Finalizado</option>
                            <option value="5">Cancelado</option>
                        </select>
                    </div>
                )}
                <Process_button className='form-button' type="submit">{ShowEditWindow ? "Enviar" : "Adicionar"}</Process_button>
            </Process_Form>
            <hr style={{ height: "15px", opacity: "0"}}/>
            <Modal isOpen={isModalOpen} onClose={() => set_ModalOpen(false)} message={formStatusMessage} messageError={fromStatusErrorMessage} DeleteConfirmation={deleteMessage}/>
        </FixedBox>
    )
}