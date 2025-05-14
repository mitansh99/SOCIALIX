import React, { useEffect } from "react";
import { db } from "./firebase/config";
import LoginForm from "./components/Auth/Login";
import RegisterForm from "./components/Auth/Register";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { ColoringData } from "./StaticData";
import UserStatusUpdater from "./components/others/UserStatusUpdater";
import ProfilePage from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import MobileSearchPage from "./pages/MobileSearchPage";
import loadingGif from "./assets/loading.gif";
import MobileFriends from "./components/Home/MobileFriends";

function App() {
  return (
    <div style={{ backgroundColor: `${ColoringData.Theme.light.baseColor}` }}>
      <UserStatusUpdater />
      <Router>
        <MainApp />
      </Router>
    </div>
  );
}

function MainApp() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        const data = JSON.parse(localStorage.getItem("userData"));

        if (data) {
          const q = query(
            collection(db, "users"),
            where("email", "==", data.email)
          );
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            navigate("/auth/login");
            return;
          }

          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          const isPasswordCorrect = bcrypt.compareSync(
            data.password,
            userData.password
          );
          if (!isPasswordCorrect) {
            navigate("/auth/login");
            return;
          }

          userData.userId = userDoc.id;
          setCurrentUser(userData);
        } else {
          navigate("/auth/login");
        }
      }
    })();
  }, [currentUser, navigate, setCurrentUser]);

  return (
    <>
      {currentUser === null ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img src={loadingGif} alt="loading" className="w-20 sm:w-32" />
        </div>
      ) : (
        <Routes>
          <Route path="/auth" element={<Auth />}>
            <Route path="register" element={<RegisterForm />} />
            <Route path="login" element={<LoginForm />} />
          </Route>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          //use for only mobile
          <Route path="/mobieSearch" element={<MobileSearchPage />} />
          <Route path="/friends" element={<MobileFriends />} />

        </Routes>
      )}
    </>
  );
}

export default App;
