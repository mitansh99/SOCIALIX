import Navbar from "../components/Home/Navbar";
import SidebarLeft from "../components/Home/SidebarLeft";
import Feed from "../components/Home/Feed";
import SidebarRight from "../components/Home/SidebarRight";
import { useAuth } from "../context/AuthContext";

const Home = () => {

const { currentUser } = useAuth();
console.log(currentUser);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 flex">
        {/* Left sidebar - hidden on mobile, fixed on large screens */}
        <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen overflow-y-auto pt-4">
          <SidebarLeft />
        </div>
        
        {/* Main content - centered */}
        <main className="flex-grow max-w-xl w-full mx-auto py-4">
          <Feed />
        </main>
        
        {/* Right sidebar - only visible on large screens */}
        <div className="hidden lg:block lg:w-72 flex-shrink-0 sticky top-0 h-screen overflow-y-auto pt-4">
          <SidebarRight />
        </div>
      </div>
      
      {/* Mobile navigation - only visible on small screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 md:hidden z-10">
        <button className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">Search</span>
        </button>
        
        <button className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-xs mt-1 text-blue-500 font-medium">Hikes</span>
        </button>
        
        <button className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-xs mt-1">Alerts</span>
        </button>
        
        <button className="flex flex-col items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
            <img 
              src="/api/placeholder/24/24" 
              alt="Profile" 
              className="h-full w-full object-cover" 
            />
          </div>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
