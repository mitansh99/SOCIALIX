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
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { ref, onValue } from "firebase/database";


const FriendCard = ({ friend, tabType , onlineStatus }) => {
  const { fullName, username } = friend;

  const renderButton = () => {
    switch (tabType) {
      case "friends":
        return (
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-600 hover:bg-blue-50">
            Message
          </button>
        );
      case "following":
        return (
          <button className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded-full border border-green-600 hover:bg-green-50 flex items-center">
            <FaUserCheck className="mr-1" /> Following
          </button>
        );
      case "followers":
        return (
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-600 hover:bg-blue-50">
            Follow Back
          </button>
        );
      default:
        return (
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-600 hover:bg-blue-50">
            Follow
          </button>
        );
    }
  };
  const profileInitial = username.charAt(0).toUpperCase();
  const isOnline = onlineStatus[friend.id] ?? false;
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-600 flex justify-center items-center  font-semibold text-lg">
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

const Friends = () => {
  const [activeTab, setActiveTab] = useState("following");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [onlineStatus, setOnlineStatus] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "users", currentUser.userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const targetIds = userData[activeTab] || [];

          if (targetIds.length > 0) {
            const chunks = [];
            while (targetIds.length) {
              chunks.push(targetIds.splice(0, 10));
            }

            const promises = chunks.map((chunk) =>
              getDocs(
                query(collection(db, "users"), where("__name__", "in", chunk))
              )
            );

            const results = await Promise.all(promises);

            const fetchedData = results.flatMap((snapshot) =>
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );

            fetchedData.map((user) => {
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
        } else {
          console.error("User not found.");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

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
              {tab === "following" ? (
                <FaUserCheck className="mr-2" />
              ) : (
                <FaUsers className="mr-2" />
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        className="bg-white rounded-lg border border-gray-200 overflow-y-auto"
        style={{ maxHeight: "400px" }}
      >
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : data.length > 0 ? (
          data.map((item) => (
            <FriendCard key={item.id} friend={item} tabType={activeTab}  onlineStatus={onlineStatus} />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No {activeTab} found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
