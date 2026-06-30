import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AgeVerification from './pages/AgeVerification';
import RegistrationForm from './pages/RegistrationForm';
import NotEligible from './pages/NotEligible';
import Success from './pages/Success';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AgeVerification />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/not-eligible" element={<NotEligible />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
