import React, { useEffect, useState } from "react";
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
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";
import { ApiProvider } from "./context/ApiContext";

function App() {
  return (
    <div style={{ backgroundColor: `${ColoringData.Theme.light.baseColor}` }}>
      <UserStatusUpdater />
      <Router>
        <ApiProvider>
        <MainApp />
        </ApiProvider>
        <Analytics />
      </Router>
    </div>
  );
}

function MainApp() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true); // <-- Add this

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        const currentPath = window.location.pathname;

        // Allow register page access
        if (currentPath === "/auth/register") {
          setLoading(false);
          return;
        }

        const data = JSON.parse(localStorage.getItem("userData"));
        if (data) {
          try {
            const q = query(
              collection(db, "users"),
              where("email", "==", data.email)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
              setLoading(false); // <-- Stop loading before navigation
              navigate("/auth/register");
              return;
            }

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            const isPasswordCorrect = bcrypt.compareSync(
              data.password,
              userData.password
            );
            if (!isPasswordCorrect) {
              setLoading(false); // <-- Stop loading before navigation
              navigate("/auth/login");
              return;
            }

            userData.userId = userDoc.id;
            setCurrentUser(userData);
          } catch (error) {
            console.log(error);
            setLoading(false); // <-- Stop loading before navigation
            navigate("/auth/register");
          } finally {
            setLoading(false); // <-- Always stop loading at the end
          }
        } else {
          setLoading(false); // <-- Stop loading if no local data
          navigate("/auth/login");
        }
      } else {
        setLoading(false); // <-- User already found
      }
    })();
  }, [currentUser, navigate, setCurrentUser]);

  return (
    <>
      {loading ? ( // <-- Use local loading state
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img src={loadingGif} alt="loading" className="w-20 sm:w-32" />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />}>
            <Route path="register" element={<RegisterForm />} />
            <Route path="login" element={<LoginForm />} />
          </Route>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/mobieSearch" element={<MobileSearchPage />} />
          <Route path="/friends" element={<MobileFriends />} />

          {/* not found page  */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
