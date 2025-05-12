import { useState, useEffect } from "react";
import { FaUserCheck, FaUsers } from "react-icons/fa";
import { db, realtimeDb } from "../../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { ref, onValue } from "firebase/database";

/** FriendCard Component */
const FriendCard = ({
  friend,
  tabType,
  onlineStatus,
  handleFollowToggle,
  isFollowing,
  loadingState,
}) => {
  const { fullName, username, id } = friend;

  const renderButton = () => {
    if (loadingState) {
      return (
        <button
          disabled
          className="text-gray-500 text-sm font-medium px-3 py-1 rounded-full border border-gray-300"
        >
          Processing...
        </button>
      );
    }

    if (tabType === "following") {
      return (
        <button
          onClick={() => handleFollowToggle(id, false)}
          className="text-red-600 hover:text-red-800 text-xs font-medium px-3 py-1 rounded-full border border-red-600 hover:bg-red-50 cursor-pointer"
        >
          Unfollow
        </button>
      );
    } else if (tabType === "followers" && !isFollowing) {
      return (
        <button
          onClick={() => handleFollowToggle(id, true)}
          className="text-[#0a0147] hover:text-blue-900 text-xs font-medium px-3 py-1 rounded-full border border-[#0a0147] hover:bg-blue-50 cursor-pointer"
        >
          Follow Back
        </button>
      );
    }
    return null;
  };

  const profileInitial = username.charAt(0).toUpperCase();
  const isOnline = onlineStatus[id] ?? false;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-600 flex justify-center items-center font-semibold text-lg">
            {profileInitial}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{fullName}</h3>
          <div className="text-xs text-gray-500">@{username}</div>
        </div>
      </div>
      {renderButton()}
    </div>
  );
};

/** Main Friends Component */
const Friends = () => {
  const [activeTab, setActiveTab] = useState("following");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [onlineStatus, setOnlineStatus] = useState({});
  const [followingIds, setFollowingIds] = useState([]);
  const [loadingState, setLoadingState] = useState({});

  /** Fetch Data */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const userDocRef = doc(db, "users", currentUser.userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const targetIds = [...userData[activeTab]] || [];
          setFollowingIds(userData.following || []);

          if (targetIds.length > 0) {
            // Firebase allows max 10 "in" queries
            const chunks = [];
            while (targetIds.length) {
              chunks.push(targetIds.splice(0, 10));
            }

            const promises = chunks.map((chunk) =>
              getDocs(query(collection(db, "users"), where("__name__", "in", chunk)))
            );

            const results = await Promise.all(promises);

            const fetchedData = results.flatMap((snapshot) =>
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );

            // Listen for online status
            fetchedData.forEach((user) => {
              const userStatusRef = ref(realtimeDb, `/onlineUsers/${user.id}`);
              onValue(userStatusRef, (snapshot) => {
                if (snapshot.exists()) {
                  setOnlineStatus((prev) => ({
                    ...prev,
                    [user.id]: snapshot.val().isOnline,
                  }));
                }
              });
            });

            setData(fetchedData);
          } else {
            setData([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  /** Handle Follow / Unfollow */
  const handleFollowToggle = async (userId, shouldFollow) => {
    setLoadingState((prev) => ({ ...prev, [userId]: true }));

    const userDocRef = doc(db, "users", currentUser.userId);
    const targetUserDocRef = doc(db, "users", userId);

    try {
      if (shouldFollow) {
        await updateDoc(userDocRef, {
          following: arrayUnion(userId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayUnion(currentUser.userId),
        });
        setFollowingIds((prev) => [...prev, userId]);
      } else {
        await updateDoc(userDocRef, {
          following: arrayRemove(userId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayRemove(currentUser.userId),
        });

        // Instantly remove from UI
        setData((prevData) => prevData.filter((user) => user.id !== userId));
        setFollowingIds((prev) => prev.filter((id) => id !== userId));
      }
    } catch (error) {
      console.error("Failed to update follow status: ", error);
    } finally {
      setLoadingState((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="pt-4 pb-2">
        <h2 className="text-2xl font-bold mb-4">Your Network</h2>
        <div className="flex border-b border-gray-200">
          {["following", "followers"].map((tab) => (
            <button
              key={tab}
              className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "following" ? <FaUserCheck className="mr-2" /> : <FaUsers className="mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-y-auto" style={{ maxHeight: "400px" }}>
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          data.map((item) => (
            <FriendCard
              key={item.id}
              friend={item}
              tabType={activeTab}
              onlineStatus={onlineStatus}
              handleFollowToggle={handleFollowToggle}
              isFollowing={followingIds.includes(item.id)}
              loadingState={loadingState[item.id]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Friends;
