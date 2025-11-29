import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home' 
import Vote from './pages/Vote'
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; 
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import CreatePoll from './pages/CreatePoll'; 
import Results from './pages/Results';

import { ToastContainer } from 'react-toastify'; // <-- 1. IMPORT

function App() {
  return (
    <> {/* <-- 2. WRAP IN FRAGMENT */}
      <Routes>
        {/* ...all your routes... */}
        <Route path="/" element={<Home />} />
        <Route path="/vote/:pollCode" element={<Vote />} />
        <Route path="/results/:pollCode" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-poll" element={<CreatePoll />} />
        </Route>
      </Routes>

      {/* 3. ADD THE TOAST CONTAINER (with dark theme) */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App