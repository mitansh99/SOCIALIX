// /src/components/Friends.jsx
import { useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";

const FriendCard = ({ friend }) => {
  const { name, username, profileImage, isOnline, location, interests } = friend;
  
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={profileImage || "/api/placeholder/40/40"}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{name}</h3>
          <div className="text-xs text-gray-500">@{username}</div>
          {location && (
            <div className="text-xs text-gray-500 flex items-center">
              <span className="mr-1">📍</span> {location}
            </div>
          )}
        </div>
      </div>
      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-600 hover:bg-blue-50">
        Follow
      </button>
    </div>
  );
};

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const friendsData = [
    {
      id: 1,
      name: "Scarlett Floyd",
      username: "floydscar",
      profileImage: "/api/placeholder/40/40",
      isOnline: true,
      location: "Mountain Heights",
      interests: ["Hiking", "Photography"]
    },
    {
      id: 2,
      name: "Rohan McKenzie",
      username: "rohanmk",
      profileImage: "/api/placeholder/40/40",
      isOnline: false,
      location: "Pine Valley",
      interests: ["Rock Climbing", "Camping"]
    },
    {
      id: 3,
      name: "Bibi Shelton",
      username: "bibi",
      profileImage: "/api/placeholder/40/40",
      isOnline: true,
      location: "Summit Ridge",
      interests: ["Trail Running", "Mountaineering"]
    },
    {
      id: 4,
      name: "Beatrice Cox",
      username: "coobea",
      profileImage: "/api/placeholder/40/40",
      isOnline: false,
      location: "Alpine Meadows",
      interests: ["Backpacking", "Nature Photography"]
    },
    {
      id: 5,
      name: "Fletcher Morse",
      username: "fletchmm",
      profileImage: "/api/placeholder/40/40",
      isOnline: true,
      location: "Evergreen Forest",
      interests: ["Mountain Biking", "Wildlife Spotting"]
    }
  ];

  const filteredFriends = friendsData.filter(friend => {
    return friend.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           friend.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className=" overflow-hidden">
      <div className="pt-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
        
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-y-auto" style={{ maxHeight: "400px" }}>
        {filteredFriends.length > 0 ? (
          <div>
            {filteredFriends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No friends found
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Friends;