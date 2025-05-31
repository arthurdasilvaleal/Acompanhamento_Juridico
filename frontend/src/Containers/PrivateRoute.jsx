import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const autenticado = localStorage.getItem("logado") === "true"

  return autenticado ? children : <Navigate to="/" />
}
