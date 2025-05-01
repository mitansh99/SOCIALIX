// /src/components/Feed.jsx
import { useState } from "react";
import { FaHeart, FaComment, FaShareAlt, FaBookmark, FaEllipsisH, FaImage, FaSmile, FaVideo, FaMapMarkerAlt } from "react-icons/fa";
import CreatePost from "./CreatePost";


const SocialMediaPostCard = ({ 
  username, 
  userHandle, 
  time, 
  profileImage, 
  content, 
  contentImage, 
  likes, 
  comments, 
  isBookmarked = false
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            <img 
              src={profileImage || "/api/placeholder/40/40"} 
              alt={username} 
              className="h-full w-full object-cover" 
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{username}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <span>@{userHandle}</span>
              <span className="mx-1">•</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <FaEllipsisH className="h-5 w-5" />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 text-sm whitespace-pre-line">{content}</p>
      </div>
      
      {/* Post Image (if available) */}
      {contentImage && (
        <div className="relative">
          <img 
            src={contentImage}
            alt="Post content"
            className="w-full object-cover"
            style={{ maxHeight: "500px" }}
          />
        </div>
      )}
      
      {/* Post Engagement */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between">
          <div className="flex space-x-6">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
              <FaHeart className={`h-5 w-5 ${likes.isLiked ? 'text-red-500' : ''}`} />
              <span className="text-xs font-medium">{likes.count}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
              <FaComment className="h-5 w-5" />
              <span className="text-xs font-medium">{comments}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
              <FaShareAlt className="h-5 w-5" />
            </button>
          </div>
          <button className={`text-gray-500 ${isBookmarked ? 'text-yellow-500' : 'hover:text-yellow-500'}`}>
            <FaBookmark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "Sarah Johnson",
      userHandle: "sarahj",
      time: "2h ago",
      profileImage: "/api/placeholder/40/40",
      content: "Just finished my morning run! 🏃‍♀️ Beautiful sunrise today at the park. Who else is getting their exercise in early?",
      contentImage: "/api/placeholder/600/400",
      likes: { count: 127, isLiked: false },
      comments: 24,
      isBookmarked: false
    },
    {
      id: 2,
      username: "Tech Enthusiast",
      userHandle: "techfan",
      time: "5h ago",
      profileImage: "/api/placeholder/40/40",
      content: "Check out this new gadget I just got! The battery life is amazing and the camera quality is top-notch. Definitely worth the investment if you're in the market for a new phone.",
      contentImage: "/api/placeholder/600/400",
      likes: { count: 215, isLiked: true },
      comments: 42,
      isBookmarked: true
    },
    {
      id: 3,
      username: "Foodie Adventures",
      userHandle: "foodlover",
      time: "Yesterday",
      profileImage: "/api/placeholder/40/40",
      content: "Made this homemade pasta from scratch using my grandmother's recipe. The secret is in the sauce! 🍝 \n\nWho wants the recipe?",
      contentImage: "/api/placeholder/600/400",
      likes: { count: 438, isLiked: false },
      comments: 87,
      isBookmarked: false
    },
    {
      id: 4,
      username: "Travel Dreamer",
      userHandle: "wanderlust",
      time: "2 days ago",
      profileImage: "/api/placeholder/40/40",
      content: "Finally made it to Bali! The beaches are just as beautiful as everyone says. Planning to explore the temples tomorrow. Any recommendations?",
      contentImage: "/api/placeholder/600/400",
      likes: { count: 562, isLiked: true },
      comments: 104,
      isBookmarked: false
    }
  ]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Your Feed</h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <div className="flex items-center space-x-1 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
            <span className="font-medium text-sm">Most Recent</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Create Post Component */}
      <CreatePost />
      
      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <SocialMediaPostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;