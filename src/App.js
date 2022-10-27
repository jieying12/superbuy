import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Homepage from './views/home/Homepage'
import CreateGroupbuyForm from './views/createGroupbuy/createGroupbuyForm'
import Login from './views/login/Login'
import Signup from './views/signup/Signup'

import './style/main.scss'

function App() {
  const { authIsReady, user } = useAuthContext()

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />}/>
            <Route path="/createGroupbuy" element={<CreateGroupbuyForm />}/>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}/>
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />}/>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App