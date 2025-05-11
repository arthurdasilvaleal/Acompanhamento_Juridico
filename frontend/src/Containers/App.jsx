import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Tela_Login/Index'
import Cadastro from './Tela_Cadastro'
import MainScreen from './MainScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/cadastro' element={<Cadastro/>} />
          <Route path='/main' element={<MainScreen/>} />
          <Route path='*' element={<h1>Notfound</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
