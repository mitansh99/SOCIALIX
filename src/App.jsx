import React, { useEffect } from 'react';
import { auth, db } from './firebase/config';
import LoginForm from './components/Auth/Login';
import RegisterForm from './components/Auth/Register';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Auth from './pages/Auth';
import Home from "./pages/Home";



function App() {
  useEffect(() => {
    console.log("🔥 Firebase Auth Instance");
    console.log("📦 Firestore DB Instance");
  }, []);

  return (
    <>
    <Router>
      <Routes>
      <Route path="/auth" element={<Auth />} >
      <Route path="/auth/register" element={<RegisterForm />} />
      <Route path="/auth/login" element={<LoginForm />} />
      </Route>
      <Route path="/home" element={<Home />} ></Route>
      </Routes>
    </Router>
    </>
  );
}

export default App;
