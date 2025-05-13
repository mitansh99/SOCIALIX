import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";

const SocialMediaPostCard = ({
  id,
  fullName,
  username,
  createdAt,
  text,
  likeCount = [],
  handleLikeToggle,
}) => {
  const { currentUser } = useAuth();
  const isLiked = likeCount.includes(currentUser.userId);

  const formattedTime = createdAt?.toDate().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short",
  });

  const profileInitial = username.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-600 flex justify-center items-center font-semibold text-lg">
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
          <button
            onClick={() => handleLikeToggle(id, isLiked)}
            className={`flex items-center space-x-1 cursor-pointer ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <FaHeart className="h-5 w-5" />
            <span className="text-xs font-medium">{likeCount.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPostCard;
