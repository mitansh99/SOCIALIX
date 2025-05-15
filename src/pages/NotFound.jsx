import { LuFileQuestion } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-slate-50">
      <div className="text-center max-w-lg ">
        {/* Illustration */}
        <div className="flex justify-center mb-8 ">
          <div className="relative">
            <div className="bg-gray-300 w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center">
              <LuFileQuestion size={64} className="text-[#0a0147]" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#0a0147] text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold">
              ?
            </div>
          </div>
        </div>
        
        {/* Error message */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-4">Page Not Found</h2>
        
        {/* Description */}
        <p className="text-gray-500 mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="px-6 py-2 bg-[#0a0147] text-white rounded-lg hover:shadow-md cursor-pointer transition-colors" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button 
            className="px-6 py-2 border border-[#0a0147] text-[#0a0147] rounded-lg hover:shadow-md cursor-pointer transition-colors"
            onClick={() => navigate('/')}
          >
            Home Page
          </button>
        </div>
      </div>
    </div>
  );
}