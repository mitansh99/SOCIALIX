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
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedPosts = postData.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(sortedPosts);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLikeToggle = async (postId, isLiked) => {
    try {
      const postRef = doc(db, "posts", postId);

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

      await updateDoc(postRef, {
        likeCount: isLiked
          ? posts
              .find((post) => post.id === postId)
              .likeCount.filter((id) => id !== currentUser.userId)
          : [
              ...posts.find((post) => post.id === postId).likeCount,
              currentUser.userId,
            ],
      });
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const SocialMediaPostCard = ({
    id,
    fullName,
    username,
    createdAt,
    text,
    likeCount = [],
  }) => {
    const isLiked = likeCount.includes(currentUser.userId);
    const formattedTime = createdAt?.toDate().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
    });

    // Get the first character of the username for the profile pic
    const profileInitial = username.charAt(0).toUpperCase();

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Profile Initial Circle */}
            <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-600 flex justify-center items-center  font-semibold text-lg">
              {profileInitial}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{fullName}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-1">@{username} •</span>
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
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
                <span className="text-xs font-medium">{likeCount.length}</span>
              </button>
              {/* <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 cursor-pointer">
                <FaComment className="h-5 w-5" />
                <span className="text-xs">Comment</span>
              </button> */}
              {/* <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 cursor-pointer">
                <FaShareAlt className="h-5 w-5" />
                <span className="text-xs">Share</span>
              </button> */}
              {/* <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 cursor-pointer">
                <FaBookmark className="h-5 w-5" />
              </button> */}
            </div>
            {/* <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaEllipsisH className="h-5 w-5" />
            </button> */}
          </div>
        </div>
      </div>
    );
  };

  const handleScroll = () => {
    if (loading) return;
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= scrollHeight - 10) {
      fetchMorePosts();
    }
  };

  const fetchMorePosts = async () => {
    if (isFetching) return; // Prevent multiple fetches at once

    setIsFetching(true);
    if (!lastDoc) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(10)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts((prev) => [...prev, ...newPosts]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      setLoading(false);
      setIsFetching(false); 
    } finally {
      setLoading(false);
      setIsFetching(false); 
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="max-w-xl mx-auto px-4 py-3  sm:mb-0 mb-12">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold">Create Post</h1>
      </div>

      <CreatePost />
      <h1 className="text-xl font-bold mb-5">Feed</h1>

      {loading && posts.length === 0 ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => <SocialMediaPostCard key={post.id} {...post} />)
          ) : (
            <div className="text-center text-gray-400">No posts to display</div>
          )}
        </div>
      )}

      {loading && posts.length > 0 && (
        <div className="text-center">Loading more...</div>
      )}
    </div>
  );
};

export default Feed;
