import { CiSearch, CiBellOn, CiSettings } from "react-icons/ci";
import logo from "../../assets/LOGO.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  if(!currentUser){
    return console.log("Loading ...")
  }
  const profileInitial = currentUser.fullName.charAt(0).toUpperCase();

  const goToProfile = () => {
    navigate(`/profile/${currentUser.userId}`);
  }
  return (
    <nav className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className=" p-2 rounded-lg">
       <img src={logo} alt=""  width={"30px"} height={"30px"}/>
      </div>
        
      </div>

      <div className="relative max-w-xl w-full mx-auto px-4 hidden sm:block outlin-none">
        <input
          type="text"
          placeholder="Search for mountains, trails, hikers, and more..."
          className="bg-gray-100 rounded-lg py-2 pl-10 pr-4 w-full text-sm outlin-none"
        />
        <CiSearch className="absolute left-7 top-2.5 text-gray-500 h-4 w-4" />
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-700">
          <CiBellOn className="h-5 w-5" />
        </button>
        <button className="text-gray-700">
          <CiSettings className="h-5 w-5" />
        </button>
       <div className="h-8 w-8 rounded-full bg-[#0a0147] p-2 border-[#fe696e] border-2 text-white flex justify-center items-center cursor-pointer text-md" onClick={goToProfile}>
          {profileInitial}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
