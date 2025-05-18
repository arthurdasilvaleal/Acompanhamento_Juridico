import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Tela_Login/Index'
import Cadastro from './Tela_Cadastro'
import MainScreen from './MainScreen'

import { HashLoader } from 'react-spinners'
import { LoadingStyle } from './style'
import { useEffect, useState } from 'react'

export default function App() {
  const [loading, set_Loading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() =>{set_Loading(false)}, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  
      
  return (
    <>
      {loading && (
        <LoadingStyle>
          <HashLoader color="#CDAF6F" size={50} />
          {/* <p style={{ color: '#fff', marginTop: '1rem' }}>Carregando sistema...</p> */}
        </LoadingStyle>
      )}
      
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