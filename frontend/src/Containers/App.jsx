import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Tela_Login/Index'
import Cadastro from './Tela_Cadastro'
import MainScreen from './MainScreen'

import Loading from '../components/Loading_Pages/Loading'
import { useEffect, useState } from 'react'

export default function App() {
  const [loading, set_Loading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() =>{set_Loading(false)}, 1500)
    
    return () => clearTimeout(timer)
  }, [])


  return (
    <>
      {loading && (<Loading />)}
      
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/cadastro' element={<Cadastro/>} />
            <Route path='/main' element={<MainScreen/>} />
            <Route path='*' element={<h1>Notfound</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}