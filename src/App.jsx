import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SigninJSX from './components/auth/Signin'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignupJSX from './components/auth/Signup'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<SigninJSX/>}></Route>
          <Route path='/signup' element={<SignupJSX/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App