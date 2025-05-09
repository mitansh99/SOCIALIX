import { useEffect, useState } from "react";
import {
  FaHeart,
  FaComment,
  FaShareAlt,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import CreatePost from "./CreatePost";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);

    const fetchPosts = () => {
      const q = query(collection(db, "posts"));

      // Real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sorting by timestamp (most recent first)
        const sortedPosts = postData.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(sortedPosts);
        setLoading(false);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    };

    fetchPosts();
  }, [currentUser]);

  // 🔄 **Handle Like Logic**
  const handleLikeToggle = async (postId, isLiked) => {
    try {
      const postRef = doc(db, "posts", postId);

      // Optimistic UI update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likeCount: isLiked
                  ? post.likeCount.filter((id) => id !== currentUser.userId)
                  : [...post.likeCount, currentUser.userId],
              }
            : post
        )
      );

      // Update Firestore
      await updateDoc(postRef, {
        likeCount: isLiked
          ? posts.find((post) => post.id === postId).likeCount.filter(
              (id) => id !== currentUser.userId
            )
          : [...posts.find((post) => post.id === postId).likeCount, currentUser.userId],
      });
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  // 📝 **Social Media Card Component**
  const SocialMediaPostCard = ({
    id,
    username,
    createdAt,
    text,
    likeCount = [],
  }) => {
    const isLiked = likeCount.includes(currentUser.userId);

    // 🕒 Format Time
    const formattedTime = new Date(createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={"/api/placeholder/40/40"}
                alt={username}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{username}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span className="mx-1">•</span>
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
          For Feature
          {/* <button className="text-gray-500 hover:text-gray-700">
            <FaEllipsisH className="h-5 w-5" />
          </button> */}
        </div>

        <div className="px-4 pb-3">
          <p className="text-gray-800 text-sm whitespace-pre-line">{text}</p>
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="flex space-x-6">
              <button
                onClick={() => handleLikeToggle(id, isLiked)}
                className={`flex items-center space-x-1 cursor-pointer ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <FaHeart className="h-5 w-5" />
                <span className="text-xs font-medium">
                  {likeCount.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Create Post</h1>
      </div>

      <CreatePost />
      <h1 className="text-xl font-bold mb-5 ">Feed</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <SocialMediaPostCard key={post.id} {...post} />
            ))
          ) : (
            <div className="text-center text-gray-400">
              No posts to display
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
