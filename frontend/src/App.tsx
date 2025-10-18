import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';

import ProductForm from './components/ProductForm';
import ProductsList from './components/ProductsList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductsList />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
