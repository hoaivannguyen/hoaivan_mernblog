import { useEffect, useState } from "react" 
import PostCard from "../components/PostCard"
import AlbumCard from "../components/AlbumCard"
import profileImage from "../images/1000001655.jpg"
import coverImage from "../images/20240104_112537.jpg"
import icon from "../images/Picture1.png"

export default function Home() {
  const [post, setPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState(null)
  const [recentAlbums, setRecentAlbums] = useState(null)

  const [timeElapsed, setTimeElapsed] = useState({})

  useEffect(() => {
    try {
      const fetchRecentAlbums = async () => {
        const res = await fetch(`/api/album/getalbums?limit=5`)
        const data = await res.json()
        if (res.ok) {
          setRecentAlbums(data.albums)
        }
      }
      fetchRecentAlbums()
    } catch (error) {
      console.log(error.message)
    }
  }, [])

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`)
        const data = await res.json()
        if (res.ok) {
          setRecentPosts(data.posts)
        }
      }
      fetchRecentPosts()
    } catch (error) {
      console.log(error.message)
    }
  }, [])

  // Calculate the difference between the start date and now
  const calculateTimeElapsed = () => {
    const now = new Date();
    const start = new Date("2003-05-07T00:00:00");
  
    // Calculate differences in years, months, days
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
  
    // Adjust the calculation for negative months or days
    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); // Days in the previous month
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
  
    return { years, months, days, hours, minutes, seconds };
  };

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  return (
      <div >
        <div className="w-full h-50 overflow-hidden relative">
          <img src={coverImage} className="absolute w-full h-full object-cover" />
          <div className="absolute w-full h-full bg-black opacity-50"></div>
          <div className="relative name flex p-10 space-x-20">
            <img src={profileImage} className="max-w-xs rounded-full relative" />
            <div className="text-base font-semibold space-y-2 py-20">
              <div className="flex items-center gap-1">
                <img src={icon} className="w-5" />
                <p className=" text-white">Self-verified Artists</p>
              </div>
              <p className="text-7xl font-bold text-white">Hoài Văn Nguyễn</p>
              <p className=" text-white">Live for</p>
              <p className=" text-white">
                {`${timeElapsed.years} years ${timeElapsed.months} months ${timeElapsed.days} days 
                ${timeElapsed.hours} hours ${timeElapsed.minutes} minutes ${timeElapsed.seconds} seconds`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-xl mt-5 font-bold">Albums</h1>
          <div className="flex flex-wrap gap-5 mt-5">
            {
              recentAlbums && recentAlbums.map((album) => (
                <AlbumCard key={album._id} album={album} />
              ))
            }
          </div>
          <h1 className="text-xl mt-5 font-bold">Recent</h1>
          <div className="flex flex-wrap max-w-5xl pt-5">
            {
              recentPosts && recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            }
          </div>
        </div>
      </div>
  )
}
