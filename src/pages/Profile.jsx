import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import Navbar from "../components/Home/Navbar";
import { useAuth } from "../context/AuthContext";
import loadingGif from "../assets/loading.gif";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  if (!currentUser) {
    navigate("/auth/login");
  }
  const user = {
    username: "mitanshpatel",
    displayName: "Mitansh Patel",
    bio: "Software Engineer passionate about creating intuitive user experiences. Working on innovative projects that solve real-world problems.",
    joinedDate: "June 2023",
    location: "San Francisco, CA",
    followers: 3492,
    following: 3492,
    posts: 217,
    website: "mitanshpatel.dev",
    socials: {
      twitter: "mitanshpatel",
      linkedin: "mitanshpatel",
      github: "mitanshdev",
    },
    expertise: [
      "Web Development",
      "UI/UX Design",
      "React.js",
      "Tailwind CSS",
      "Node.js",
    ],
    languages: ["English", "Hindi", "Spanish"],
    collaborators: [
      { name: "Jenny Wilson", img: null },
      { name: "Derick Lee", img: null },
      { name: "Scott Spence", img: null },
      { name: "Ariana", img: null },
    ],
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser === null ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img src={loadingGif} alt="loading" className="w-20 sm:w-32" />
        </div>
      ) : (
        <div>
          <Navbar />
          <div className="bg-white pt-5">
            <div className="container mx-auto px-4 md:px-6">
              {/* Cover Image */}
              <div className="h-36 md:h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg relative">
                {/* Profile image positioned at bottom center of cover */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#0a0147] text-white h-24 w-24 rounded-full flex items-center justify-center text-3xl font-semibold border-4 border-[#fe696e]">
                    {getInitials(user.displayName)}
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.displayName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  @{user.username} · Joined {user.joinedDate}
                </p>

                <p className="mt-4 text-gray-700 max-w-lg mx-auto text-sm ">
                  {user.bio}
                </p>

                {/* Stats */}
                <div className="flex justify-center mt-6 space-x-6 md:space-x-12">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {user.followers.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {user.following.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {user.posts.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-center gap-3">
                  <button className="bg-[#0a0147] text-white text-sm px-6 py-2 rounded-full font-medium transition-colors cursor-pointer">
                    Follow
                  </button>
                  <button className="bg-white text-sm text-gray-700 px-6 py-2 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                    Message
                  </button>
                  <button className="bg-white text-sm text-gray-700 p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                    <CiEdit />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="container mx-auto px-4 md:px-6 py-6">
            <div className="max-w-3xl mx-auto">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Posts Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Posts
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          {/* Profile Initial Circle */}
                          <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-600 flex justify-center items-center  font-semibold text-lg">
                            A
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.displayName}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="mr-1">
                                @{getInitials(user.displayName)} •
                              </span>
                              <span>10 May, 12:11 pm</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-3">
                        <p className="text-gray-800 text-sm whitespace-pre-line">
                          {" "}
                          i am good at my job
                        </p>
                      </div>

                      <div className="px-4 py-3 border-t border-gray-100">
                        <div className="flex justify-between">
                          <div className="flex space-x-6">
                            <button
                              onClick={() => handleLikeToggle(id, isLiked)}
                              className={`flex items-center space-x-1 cursor-pointer `}
                            >
                              {/* // ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"} */}
                              <FaHeart className="h-5 w-5" />
                              <span className="text-xs font-medium">1</span>
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
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
