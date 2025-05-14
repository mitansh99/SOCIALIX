import { useState, useEffect } from "react";
import { CiSearch, CiBellOn } from "react-icons/ci";
import logo from "../../assets/LOGO.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import loadingGif from "../../assets/searchLoading.gif";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  query,
  getDocs,
} from "firebase/firestore";
import debounce from "lodash.debounce";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  if (!currentUser) {
    console.log("Loading ...");
    return;
  }

 
  const profileInitial = currentUser.fullName.charAt(0).toUpperCase();

  const goToProfile = () => {
    navigate(`/profile/${currentUser.userId}`);
  };

  // ✅ **Handle Search Input**
  const handleSearch = debounce(async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        orderBy("username"),
        startAt(term),
        endAt(term + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults(users);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
    setLoading(false);
  }, 300);

  // ✅ **Handle Input Change**
  const onChangeSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  // ✅ **Navigate to Selected User's Profile**
  const goToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchResults([]);
    setSearchTerm("");
  };
  return (
    <nav className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between relative">
      <div className="flex items-center">
        <div className="p-2 rounded-lg">
          <img src={logo} alt="Logo" width={"30px"} height={"30px"} />
        </div>
      </div>

      <div className="relative max-w-xl w-full mx-auto px-4 hidden sm:block">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={onChangeSearch}
          className="bg-gray-100 rounded-lg py-2 pl-10 pr-4 w-full text-sm outline-none"
        />
        <CiSearch className="absolute left-7 top-2.5 text-gray-500 h-4 w-4" />

        {/* 🔍 **Dropdown Search Results** */}
        {searchTerm && searchResults.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="px-4 py-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => goToUserProfile(user.id)}
              >
                <p className="text-gray-800 font-medium">{user.fullName}</p>
                <p className="text-gray-500 text-sm">@{user.username}</p>
              </div>
            ))}
          </div>
        )}

        {/* 🔄 **Loading Spinner** */}
        {loading && (
          <div className="absolute right-10 top-2.5">
            <img src={loadingGif} alt="Loading" className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className=" items-center space-x-4 flex ">
       
        <div
          className="h-8 w-8 rounded-full bg-[#0a0147] p-2 border-[#fe696e] border-2 text-white flex justify-center items-center cursor-pointer text-md"
          onClick={goToProfile}
        >
          {profileInitial}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
