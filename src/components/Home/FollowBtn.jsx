import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

export default function FollowButton({ userId }) {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnStatusLoading, setBtnStatusLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      setBtnStatusLoading(true);
      const userRef = doc(db, "users", currentUser.userId);
      const userSnapshot = await getDoc(userRef);
      if (
        userSnapshot.exists() &&
        userSnapshot.data().following.includes(userId)
      ) {
        setIsFollowing(true);
      }
      setBtnStatusLoading(false);
    };
    fetchFollowStatus();
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    setLoading(true);
    await updateDoc(doc(db, "users", currentUser.userId), {
      following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
    });
    await updateDoc(doc(db, "users", userId), {
      followers: isFollowing
        ? arrayRemove(currentUser.userId)
        : arrayUnion(currentUser.userId),
    });
    setIsFollowing(!isFollowing);
    setLoading(false);
  };

  return (
    <>
      {btnStatusLoading ? (
        <div className="mt-4 md:mt-0 bg-gray-300 cursor-not-allowed px-6 py-2 rounded-md animate-pulse w-24 h-9"></div>
      ) : (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`mt-4 md:mt-0 bg-[#0a0147] cursor-pointer  px-6 py-2 rounded-md text-gray-500 hover:shadow-md transition duration-200 ease-in-out  font-medium text-sm ${
            loading
              ? "bg-gray-300"
              : isFollowing
              ? "bg-transparent border border-red-500 text-red-500"
              : "text-white"
          }`}
        >
          {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </>
  );
}
