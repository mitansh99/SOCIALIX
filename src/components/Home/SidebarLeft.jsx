import { FaUsers, FaVideo, FaImage, FaMap, FaMapPin } from 'react-icons/fa';

const SidebarLeft = () => {
  return (
    <div className="pr-4">
    <div className="flex flex-col items-center mb-6">
      <div className="h-20 w-20 rounded-full border-4 border-blue-500 p-1 mb-2">
        <img 
          src="/api/placeholder/80/80" 
          alt="Profile" 
          className="rounded-full h-full w-full object-cover" 
        />
      </div>
      <h2 className="font-bold text-lg">Alexis Wells</h2>
      <p className="text-gray-500 text-sm">@wellsalex</p>
      
      <div className="flex justify-between w-full mt-4">
        <div className="flex flex-col items-center">
          <span className="font-bold">4.6k</span>
          <span className="text-xs text-gray-500">Following</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">4.6k</span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">4.6k</span>
          <span className="text-xs text-gray-500">Event</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-1">
      <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100">
        <div className="text-gray-600">
          <FaUsers className="h-5 w-5" />
        </div>
        <span className="text-sm">Feed</span>
      </button>
      
      <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100">
        <div className="text-gray-600">
          <FaUsers className="h-5 w-5" />
        </div>
        <span className="text-sm">Friends</span>
      </button>
      
      <button className="flex items-center space-x-3 w-full p-2 rounded-lg bg-blue-50 text-blue-800 font-medium">
        <div className="text-blue-600">
          <FaMapPin className="h-5 w-5" />
        </div>
        <span className="text-sm">Hikes</span>
      </button>
      
      <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100">
        <div className="text-gray-600">
          <FaVideo className="h-5 w-5" />
        </div>
        <span className="text-sm">Videos</span>
      </button>
      
      <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 relative">
        <div className="text-gray-600">
          <FaImage className="h-5 w-5" />
        </div>
        <span className="text-sm">Photos</span>
        <div className="absolute right-2 top-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
          3
        </div>
      </button>
      
      <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100">
        <div className="text-gray-600">
          <FaMap className="h-5 w-5" />
        </div>
        <span className="text-sm">Map</span>
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
