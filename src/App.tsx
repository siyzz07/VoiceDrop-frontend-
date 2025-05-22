import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/*' element={<UserRoutes/>}/>
    </Routes>
     </BrowserRouter>
  )
}

export default App
