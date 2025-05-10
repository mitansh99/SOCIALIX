import React, { useEffect } from "react";
import { auth, db } from "./firebase/config";
import LoginForm from "./components/Auth/Login";
import RegisterForm from "./components/Auth/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { ColoringData } from "./StaticData";
import UserStatusUpdater from "./components/others/UserStatusUpdater";

function App() {
  return (
    <div style={{ backgroundColor: `${ColoringData.Theme.light.baseColor}` }}>
      <UserStatusUpdater />

      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />}>
            <Route path="register" element={<RegisterForm />} />
            <Route path="login" element={<LoginForm />} />
          </Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
