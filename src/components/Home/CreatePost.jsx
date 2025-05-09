import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import USER from "../../assets/USER.png";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import loadingGif from "../../assets/loading.gif"

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth(); // assuming currentUser is already managed
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!postText.trim()) return;

    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    const postData = {
      text: postText.trim(),
      userId: currentUser?.userId || "unknown",
      username: currentUser.username || "Anonymous",
      createdAt: new Date(),
      likeCount: 0,
    };
    try {
      await addDoc(collection(db, "posts"), postData);
      setPostText("");
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Failed to create post:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm mb-6 p-4" >
       {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[2px] " >
                <img src={loadingGif} alt="loading" className="w-20 sm:w-32" />
              </div>
            )}
      <div className={`flex items-start space-x-3 ${
          isLoading ? "opacity-30" : ""
        }`}>
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img src={USER} alt="user" className="h-full w-full object-cover" />
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <span className="font-medium text-sm">
              {currentUser?.fullName || "Name"}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={3}
            />

            <div className="mt-3">
              <button
                type="submit"
                disabled={!postText.trim()}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  postText.trim()
                    ? `bg-[#0a0147] text-white hover:bg-[#0a0147]`  // Custom HEX color
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } transition-colors`}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
