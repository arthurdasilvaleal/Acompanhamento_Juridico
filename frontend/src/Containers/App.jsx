import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Tela_Login/Index'
import Cadastro from './Tela_Cadastro'
import MainScreen from './MainScreen'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/cadastro' element={
            <AdminRoute>
              <Cadastro/>
            </AdminRoute>
          } />
          <Route path='/main' element={
            <PrivateRoute>
              <MainScreen/>
            </PrivateRoute>
            } />
          <Route path='*' element={<h1>Notfound</h1>} />
      </Routes>
    </BrowserRouter>
  )
}