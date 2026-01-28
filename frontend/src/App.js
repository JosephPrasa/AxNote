import React from 'react';
import './App.css';
import Header from './components/Header';
import LandingPage from './screens/LandingPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyNotes from './screens/MyNotes';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
const API = process.env.REACT_APP_API_URL || "http://localhost:5000"

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/mynotes" element={<MyNotes />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}



export default App;
