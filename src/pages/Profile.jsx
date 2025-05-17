import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import SocialMediaPostCard from "../components/Home/SocialMediaPostCard";
import loadingGif from "../assets/loading.gif";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import MobileNav from "../components/Home/MobileNav";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [totalPostsCount, setTotalPostsCount] = useState(0); // ✅ Track Total Post Count
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setUser({ id: userSnapshot.id, ...userSnapshot.data() });
      } else {
        navigate("/not-found");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userId, navigate]);

  // ✅ Fetch Total Post Count
  useEffect(() => {
    const fetchPostCount = async () => {
      const q = query(collection(db, "posts"), where("userId", "==", userId));

      const snapshot = await getDocs(q);
      setTotalPostsCount(snapshot.size); // ✅ Set the total count of posts
    };

    fetchPostCount();
  }, [userId]);

  // ✅ Fetch User Posts (Real-time)
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          likeCount: doc.data().likeCount || [],
        }));

        setPosts(postData);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setPosts([]);
        setLastDoc(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // ✅ Fetch More Posts when scrolled to bottom
  const fetchMorePosts = async () => {
    if (isFetching || !lastDoc) return;
    setIsFetching(true);

    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(5)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        likeCount: doc.data().likeCount || [],
      }));

      setPosts((prev) => [...prev, ...newPosts]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } else {
      setLastDoc(null);
    }
    setIsFetching(false);
  };

  const handleBack = () => {
    navigate(-1); // Go back
  };

  // ✅ Scroll Event to Trigger Post Fetching
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 10
      ) {
        fetchMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastDoc, isFetching]);

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

      // Firestore update with arrayUnion / arrayRemove
      await updateDoc(postRef, {
        likeCount: isLiked
          ? arrayRemove(currentUser.userId)
          : arrayUnion(currentUser.userId),
      });
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Profile Section */}
      {loading || !user ? (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50">
          <img src={loadingGif} alt="loading" className="w-20 sm:w-32" />
        </div>
      ) : (
        <div className="bg-white pt-5">
          <button
            onClick={handleBack}
            className="ml-5 hidden md:block  underline px-4 py-2 rounded-lg font-semibold text-[#0a0147] transition cursor-pointer "
          >
            ← Go Back
          </button>

          <div className="container mx-auto px-4 md:px-6">
            {/* Cover Image */}
            <div className={"h-36 md:h-48 rounded-lg relative bg-gray-100"}>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#0a0147] text-white h-24 w-24 rounded-full flex items-center justify-center text-3xl font-semibold border-4 border-[#fe696e]">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="pt-16 pb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h1>
              <p className="text-gray-500 text-xs mt-1">
                @{user.username} · Joined{" "}
                {user.createdAt.toDate().toLocaleDateString("en-GB")}
              </p>

              <p className="mt-4 text-gray-700 max-w-lg mx-auto text-md ">
                {user.bio}
              </p>

              {/* Stats */}
              <div className="flex justify-center mt-6 space-x-6 md:space-x-12">
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {user.followers?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {user.following?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {totalPostsCount} {/* ✅ Show Total Posts Count */}
                  </div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <main className="container mx-auto px-4 md:px-10 py-6 md:mb-0 mb-10">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 py-3  ">Your Posts</h2>
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <SocialMediaPostCard
                  key={post.id}
                  {...post}
                  handleLikeToggle={handleLikeToggle}
                />
              ))
            ) : (
              <p className="text-center text-sm text-gray-400">
                No posts available.
              </p>
            )}
          </div>

          {isFetching && (
            <div className="flex justify-center mt-4">
              Loading more posts...
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
