import { FaUsers, FaVideo, FaImage, FaMap, FaMapPin } from 'react-icons/fa';
import {useAuth} from '../../context/AuthContext';
import USER from '../../assets/USER.png';
import {ColoringData} from "../../StaticData"
 
const SidebarLeft = () => {
  const {currentUser} = useAuth();
  return (
    <div className="pr-4">
    <div className="flex flex-col items-center mb-6">
      <div className="h-20 w-20 rounded-full p-1 mb-2" style={{border: `3px solid ${ColoringData.Theme.light.primarColor}`}}>
        <img 
          src={USER}
          alt="Profile" 
          className="rounded-full h-full w-full object-cover" 
        />
      </div>
      <h2 className="font-bold text-lg">{currentUser?.fullName|| "Name"}</h2>
      <p className="text-gray-500 text-sm">@{currentUser?.username||"username"}</p>
      
      <div className="flex justify-between w-full mt-4">
        <div className="flex flex-col items-center">
          <span className="font-bold">{currentUser?.following ||"0"}</span>
          <span className="text-xs text-gray-500">Following</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{currentUser?.followers|| "0"}</span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{currentUser?.posts||"0"}</span>
          <span className="text-xs text-gray-500">Posts</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-1">
      <button className="flex items-center space-x-3 w-full p-3 rounded-lg" style={{backgroundColor: `${ColoringData.Theme.light.primarColor}` , color: 'white'}}>
        <div className="text-gray-50">
          <FaUsers className="h-5 w-5" />
        </div>
        <span className="text-sm">Feed</span>
      </button>
      
      <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-100">
        <div className="text-gray-600">
          <FaUsers className="h-5 w-5" />
        </div>
        <span className="text-sm">Friends</span>
      </button>
    </div>
    
    <div className="mt-6">
      <h3 className="text-xs font-semibold text-gray-500 px-2 mb-2">PAGES YOU LIKE</h3>
      <div className="space-y-2">
        {['World of Mountains', 'Mountain Life', 'Mountains Calling', 'Mountaineering'].map((page, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <div className="h-7 w-7 rounded-md bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xs">⛰️</span>
            </div>
            <span className="text-sm">{page}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default SidebarLeft;
