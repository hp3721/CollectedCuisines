// package imports
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
// page imports
import Login from "./pages/Login";
import Home from "./pages/Home";

import { usePocket } from "./PbContext";

function App() {

  // hooks
  const { user } = usePocket();

  return (
    <Router>
      <Routes>
        <Route path='/' element={user != undefined ? <Navigate to='/app' /> : <Login />} />
        <Route path='/login' element={user != undefined ? <Navigate to='/app' /> : <Login />} />
        <Route path='/app' element={user != undefined ? <Home /> : <Navigate to='/login' />} />
      </Routes>
    </Router>
  )
}

export default App