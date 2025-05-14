import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import loadingGif from "../assets/searchLoading.gif";
import { collection, query, orderBy, startAt, endAt, getDocs } from "firebase/firestore";
import debounce from "lodash.debounce";
import Navbar from "../components/Home/Navbar";
import MobileNav from "../components/Home/MobileNav";

const MobileSearchPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ **Handle Search Input with Debounce**
  const handleSearch = debounce(async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("username"), startAt(term), endAt(term + "\uf8ff"));
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
    <>
        <Navbar />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-top">
      <div className="w-full max-w-md p-6 rounded-lg ">
        <h1 className="text-2xl font-bold text-gray-900 text-left mb-6">Search Users</h1>

        {/* Search Input */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={onChangeSearch}
            className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none"
          />
          <CiSearch className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center">
            <img src={loadingGif} alt="Loading" className="w-6 h-6" />
          </div>
        )}

        {/* Search Results */}
        {searchTerm && searchResults.length > 0 && (
          <div className="mt-6">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 px-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => goToUserProfile(user.id)}
              >
                <div>
                  <p className="text-gray-800 font-medium">{user.fullName}</p>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {searchTerm && searchResults.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">No results found.</p>
        )}
      </div>
    </div>
    <MobileNav />
    </>
  );
};

export default MobileSearchPage;
