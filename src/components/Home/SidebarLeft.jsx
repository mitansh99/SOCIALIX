import { FiUsers } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase/config"; // Firestore config import
import USER from "../../assets/USER.png"; // Profile placeholder image
import { ColoringData } from "../../StaticData"; // Custom color theme

const SidebarLeft = () => {
  const { currentUser } = useAuth();
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Real-time listener for post count, followers, and following
  useEffect(() => {
    if (currentUser?.userId) {
      // Posts reference and listener
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userId", "==", currentUser.userId));
      const unsubscribePosts = onSnapshot(q, (snapshot) => {
        setPostCount(snapshot.size);
      });

      // Followers and Following reference and listeners
      const userRef = doc(db, "users", currentUser.userId);
      const unsubscribeUser = onSnapshot(userRef, (doc) => {
        const data = doc.data();
        setFollowersCount(data?.followers?.length || 0);
        setFollowingCount(data?.following?.length || 0);
      });

      // Cleanup listeners on unmount
      return () => {
        unsubscribePosts();
        unsubscribeUser();
      };
    }
  }, [currentUser]);

  return (
    <div className="pr-4">
      <div className="flex flex-col items-center mb-6">
        <div
          className="h-20 w-20 rounded-full p-1 mb-2"
          style={{
            border: `3px solid ${ColoringData.Theme.light.primarColor}`,
          }}
        >
          <img
            src={USER}
            alt="Profile"
            className="rounded-full h-full w-full object-cover"
          />
        </div>
        <h2 className="font-bold text-lg">{currentUser?.fullName || "Name"}</h2>
        <p className="text-gray-500 text-sm">
          @{currentUser?.username || "username"}
        </p>

        <div className="flex justify-between w-full mt-4">
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
          className="flex items-center space-x-3 w-full p-3 rounded-lg"
          style={{
            backgroundColor: `${ColoringData.Theme.light.primarColor}`,
            color: "white",
          }}
        >
          <div className="text-gray-50">
            <BiCategoryAlt className="h-5 w-5" />
          </div>
          <span className="text-sm">Feed</span>
        </button>

        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
          <div className="text-gray-600">
            <FiUsers className="h-5 w-5" />
          </div>
          <span className="text-sm">Friends</span>
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-gray-500 px-2 mb-2">
          PAGES YOU LIKE
        </h3>
        <div className="space-y-2">
          {[
            "World of Mountains",
            "Mountain Life",
            "Mountains Calling",
            "Mountaineering",
          ].map((page, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="h-7 w-7 rounded-md bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs">⛰️</span>
              </div>
              <span className="text-sm">{page}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
