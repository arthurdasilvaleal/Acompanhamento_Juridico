import { Navigate, useLocation } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const location = useLocation()
  
  // Verifica se o usuário está autenticado
  const autenticado = localStorage.getItem("logado") === "true"
  
  // Se não estiver autenticado, redireciona para login
  if (!autenticado) {
    return <Navigate to="/" />
  }
  
  // Verifica se o usuário é administrador através do state da navegação ou localStorage
  const getStateData = () => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state
    }
    
    // Fallback para localStorage
    const userData = localStorage.getItem("userData")
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error("Erro ao parsear dados do usuário do localStorage:", error)
      }
    }
    
    return {}
  }
  
  const { codigoTipo } = getStateData()
  const isAdmin = codigoTipo === 1
  
  // Se não for administrador, redireciona para a página principal com os dados do usuário
  if (!isAdmin) {
    // Recupera dados do localStorage como fallback
    const userData = localStorage.getItem("userData")
    let fallbackData = {}
    
    if (userData) {
      try {
        fallbackData = JSON.parse(userData)
      } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error)
      }
    }
    
    return <Navigate to="/main" state={fallbackData} />
  }

  // Se for administrador, permite acesso
  return children
}
