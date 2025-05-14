import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import SocialMediaPostCard from "./SocialMediaPostCard";
import CreatePost from "./CreatePost";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { currentUser } = useAuth();

  // 🔄 **Initial Fetch for First 10 Posts**
  useEffect(() => {
    setLoading(true);

    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(7)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postData);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 🔄 **Handle Like Toggle**
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

  // 🔄 **Infinite Scroll Handler**
  const fetchMorePosts = async () => {
    if (isFetching || !lastDoc) return;
    setIsFetching(true);

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
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // 🔄 **Scroll Event Listener**
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

  return (
    <div className="max-w-xl mx-auto px-4 py-3 md:mb-0 mb-10">
      <CreatePost />
      <h1 className="text-xl font-bold mb-5">Feed</h1>

      {loading && posts.length === 0 ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <SocialMediaPostCard
              key={post.id}
              {...post}
              handleLikeToggle={handleLikeToggle}
            />
          ))}
        </div>
      )}

      {isFetching && (
        <div className="text-center">Loading more posts...</div>
      )}
    </div>
  );
};

export default Feed;
