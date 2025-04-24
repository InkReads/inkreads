import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Home from '@/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
