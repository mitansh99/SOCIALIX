import { useState } from "react";
import { createPost } from "../../firebase/postUtils"; // ✅ Import createPost
import {useAuth} from "../../context/AuthContext"

const CreatePost = ({ username = "Your Name", userId, profilePic }) => {
  const [postText, setPostText] = useState("");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postText.trim()) {
      // Send post to Firebase
      const postData = {
        text: postText,
        username,
        userId: currentUser.id,
        profilePic,
        LikeCount: 0,
      };

      const result = await createPost(postData);

      if (result.success) {
        console.log("Post created successfully!");
        setPostText(""); // clear text
      } else {
        console.error("Failed to post:", result.error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 p-4">
      <div className="flex items-start space-x-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img 
            src={profilePic || "/default-profile.png"} 
            alt={username} 
            className="h-full w-full object-cover" 
          />
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <span className="font-medium text-sm">{username}</span>
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
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
