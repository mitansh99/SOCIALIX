import Navbar from "../components/Home/Navbar";
import SidebarLeft from "../components/Home/SidebarLeft";
import Feed from "../components/Home/Feed";
import SidebarRight from "../components/Home/SidebarRight";
import { useAuth } from "../context/AuthContext";
import { ColoringData } from "../StaticData";
import bcrypt from "bcryptjs";
import { useEffect, useState } from "react";
import loadingGif from "../assets/loading.gif";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Friends from "../components/Home/Friends";
import { useNavigate } from "react-router-dom";
import "../App.css";
import MobileNav from "../components/Home/MobileNav";

const Home = () => {
  // const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [activeCompo, setActiveCompo] = useState("Feed");
  const navigate = useNavigate();

   if (!currentUser) {
      navigate("/auth/login");
    }

  const handleNavigation = (compo) => {
    setActiveCompo(compo);
  };
  return (
    <div className="min-h-screen">
      {currentUser === null ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img src={loadingGif} alt="loading" className="w-20 sm:w-32" />
        </div>
      ) : (
        <div>
          <Navbar />
          <div
            className="max-w-7xl mx-auto px-4 flex"
            style={{ backgroundColor: `${ColoringData.Theme.light.baseColor}` }}
          >
            {/* Left sidebar - hidden on mobile, fixed on large screens */}
            <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen overflow-y-auto pt-4 scrollbar-hide">
              <SidebarLeft
                onNavigate={handleNavigation}
                activeComponent={activeCompo}
              />
            </div>

            {/* Main content - centered */}
            <main className="flex-grow max-w-xl w-full mx-auto py-4">
              {activeCompo === "Feed" ? <Feed /> : <Friends />}
            </main>

            {/* Right sidebar - only visible on large screens */}
            <div className="hidden lg:block lg:w-72 flex-shrink-0 sticky top-0 h-screen overflow-y-auto pt-4 scrollbar-hide">
              <SidebarRight />
            </div>
          </div>

          {/* Mobile navigation - only visible on small screens */}
         <MobileNav />
        </div>
      )}
    </div>
  );
};

export default Home;
