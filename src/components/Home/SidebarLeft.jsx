import { FiUsers } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { ColoringData } from "../../StaticData";
import "../../App.css";

const SidebarLeft = ({ onNavigate, activeComponent }) => {
  const { currentUser } = useAuth();
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  // Fetch Quote of the Day from quotable.io
useEffect(() => {
  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://zenquotes.io/api/random?timestamp=${new Date().getTime()}`
        )}`
      );
      const data = await res.json();
      const parsedData = JSON.parse(data.contents);
      setQuote({
        quoteText: parsedData[0].q,
        quoteAuthor: parsedData[0].a || "Unknown",
      });
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setQuote({
        quoteText: "Stay connected. Stay inspired.",
        quoteAuthor: "Unknown",
      });
    } finally {
      setLoadingQuote(false);
    }
  };

  fetchQuote();
}, []);


  useEffect(() => {
    if (currentUser?.userId) {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userId", "==", currentUser.userId));
      const unsubscribePosts = onSnapshot(q, (snapshot) => {
        setPostCount(snapshot.size);
      });

      const userRef = doc(db, "users", currentUser.userId);
      const unsubscribeUser = onSnapshot(userRef, (doc) => {
        const data = doc.data();
        setFollowersCount(data?.followers?.length || 0);
        setFollowingCount(data?.following?.length || 0);
      });

      return () => {
        unsubscribePosts();
        unsubscribeUser();
      };
    }
  }, [currentUser]);

  return (
    <div className="px-2 py-5 flex flex-col h-full">
      <div className="flex flex-col items-center mb-6">
        <div
          className="h-20 w-20 rounded-full bg-[#0a0147] flex justify-center items-center text-white font-semibold text-3xl mb-5"
          style={{
            border: `4px solid ${ColoringData.Theme.light.secondaryColor}`,
          }}
        >
          {currentUser?.fullName
            ? currentUser.fullName.charAt(0).toUpperCase()
            : "U"}
        </div>
        <h2 className="font-bold text-lg">{currentUser?.fullName || "Name"}</h2>
        <p className="text-gray-500 text-sm">
          @{currentUser?.username || "username"}
        </p>

        <div className="flex justify-between w-full mt-4 px-5">
          <div className="flex flex-col items-center">
            <span className="font-bold">{followingCount}</span>
            <span className="text-xs text-gray-500">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">{followersCount}</span>
            <span className="text-xs text-gray-500">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">{postCount}</span>
            <span className="text-xs text-gray-500">Posts</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => onNavigate("Feed")}
          className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
            ${
              activeComponent === "Feed"
                ? "bg-[#0a0147] text-white"
                : "hover:bg-gray-200 hover:text-dark"
            }`}
        >
          <div>
            <BiCategoryAlt className="h-5 w-5" />
          </div>
          <span className="text-sm">Feed</span>
        </button>

        <button
          onClick={() => onNavigate("Friends")}
          className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer
            ${
              activeComponent === "Friends"
                ? "bg-[#0a0147] text-white"
                : "hover:bg-gray-200 hover:text-dark"
            }`}
        >
          <div>
            <FiUsers className="h-5 w-5" />
          </div>
          <span className="text-sm">Friends</span>
        </button>
      </div>

      {/* Quote of the Day */}
      <div
        className="mt-6  rounded-lg  max-w-full"
        style={{ minHeight: "140px" }}
      >
        {loadingQuote ? (
          <div className="flex flex-col items-right w-full max-w-md bg-white rounded-xl shadow-md p-4 relative">
            {/* Skeleton for the quote mark */}
            <div className="absolute text-gray-200 text-7xl mb-1 animate-pulse">
              "
            </div>

            {/* Skeleton for the quote text */}
            <div className="text-center mb-1 mt-8 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
            </div>

            {/* Skeleton for the author */}
            <div className="flex justify-end mt-2">
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-right w-full max-w-md bg-white rounded-xl shadow-md p-4">
            <div className="absolute text-gray-500 text-7xl mb-1">"</div>
            <div className="text-black text-center font-semibold italic mb-1 mt-8">
              {quote.quoteText}
            </div>
            <div className="text-gray-600 text-right text-xs mb-1 mt-2">
              -{quote.quoteAuthor}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;
