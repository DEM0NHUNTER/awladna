import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginPage } from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ChildProfilePage from './pages/ChildProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import NavBar from './components/NavBar'; // Correct import [[2]]
import PrivateRoute from './components/PrivateRoute'; // Ensure you have a PrivateRoute component
function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <NavBar />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat"element={<PrivateRoute><ChatPage /></PrivateRoute>}/>
        <Route path="/profiles" element={token ? <ChildProfilePage /> : <LoginPage />} />
        {/* Add other routes */}
    </Router>
  );
}

export default App;