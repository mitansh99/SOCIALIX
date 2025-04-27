import Navbar from "../components/Home/Navbar";
import SidebarLeft from "../components/Home/SidebarLeft";
import Feed from "../components/Home/Feed";
import SidebarRight from "../components/Home/SidebarRight";

const Home = () => {
  return (
    <div className="pt-16">
      <Navbar />
      <div className="flex justify-center">
        <SidebarLeft />
        <Feed />
        <SidebarRight />
      </div>
    </div>
  );
};

export default Home;
