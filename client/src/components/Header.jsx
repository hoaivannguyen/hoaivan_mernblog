import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  
  return (
    <Navbar className=" dark:bg-black dark:text-white flex justify-center sticky top-0 z-10">
      <Link to="/" className="self-center whitespace-nonwrap text-sm sm:text-xl font-semibold">
      <span className="px-2 py-1 bg-[#1DB954] rounded-lg text-white">MERN</span>
      Blog
      </Link>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Link to="/" className="">
          <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
            <GoHomeFill className="px-0"/>
          </Button>
        </Link> 
        <TextInput 
            type="text" 
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline font-semibold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff', borderRadius: '9999px' }}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown 
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm"> {currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
        <Link to="/sign-in">
          <Button 
            color=""
            className="w-full bg-[#1DB954] text-white hover:bg-[#1aa94c]" 
            pill
          >
            Sign In
        </Button>
        </Link>
        )}
        <Navbar.Toggle />
      </div>
    </Navbar>
  )
}
