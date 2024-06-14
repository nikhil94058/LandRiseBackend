import logo from './logo.svg';
import './App.css';
import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';
import Test from './Components/Test';
import LoginPage from './Pages/LoginPage';
import Land from './Pages/Land';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Pages/SignUp';
import Footer from './Components/Footer';
import LandregisteryPage from './Pages/LandregisteryPage';
import Transaction from './Pages/Transaction';
import { useEffect, useState } from 'react';

// ProtectedRoute component to handle role-based routing
const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole') || 'guest';
  return userRole === allowedRole ? children : <Navigate to="/login" />;
};

function App() {
  // Retrieve the user's role from localStorage or default to 'guest' if not available
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'guest');

  // Listen for changes in localStorage (e.g., userRole updates)
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('userRole') || 'guest');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Set document title with logo image dynamically
  useEffect(() => {
    document.title = userRole === 'admin' ? `Admin Dashboard | LandSol` : `User Dashboard | LandSol`;
  }, [userRole]);

  return (
    <main className="h-screen">
      <div className="flex flex-col h-full">
        <Navbar />
        <div className="flex flex-grow">
          <div className="fixed left-0 top-[4.4rem] h-full">
            <Test />
          </div>
          <div className="md:ml-[6rem] container overflow-y-auto">
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/property/:id" element={<Land />} />
              <Route path="/register" element={<LandregisteryPage />} />
              <Route path="/transaction" element={<Transaction />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRole="user">
                    <HomePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default App;
