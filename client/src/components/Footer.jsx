import { Footer } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { FaFastForward, FaFastBackward, FaStepBackward, FaStepForward, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { PhotoContext } from '../PhotoContext'; // Import context
import { HiSpeakerWave } from "react-icons/hi2";

export default function FooterCom({ showModal, setShowModal }) {
  const albumSlug = useLocation().pathname.split('/')[2];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [album, setAlbum] = useState(null);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0); // State for progress bar
  const { currentPhotoIndex, setCurrentPhotoIndex } = useContext(PhotoContext); // Use shared state
  const currentIndex = albums.findIndex(a => a.slug === albumSlug);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume state (1 = max)
  const audioRef = useRef(null); // Reference for audio element

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/album/getalbums?slug=${albumSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        setAlbum(data.albums[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    const fetchAllAlbums = async () => {
      try {
        const res = await fetch('/api/album/getalbums');
        const data = await res.json();

        if (res.ok) {
          setAlbums(data.albums);
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
    fetchAllAlbums();
  }, [albumSlug]);

  const handleNextPhoto = () => {
    if (album && album.photos) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % album.photos.length); // Loop to the first photo after the last
    }
  };

  const handlePreviousPhoto = () => {
    if (album && album.photos) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + album.photos.length) % album.photos.length); // Loop to the last photo if going backward from the first
    }
  };

  const handleNextAlbum = () => {
    if (currentIndex < albums.length - 1) {
      const nextAlbumSlug = albums[currentIndex + 1].slug;
      navigate(`/album/${nextAlbumSlug}`);
    }
  };

  const handlePreviousAlbum = () => {
    if (currentIndex > 0) {
      const prevAlbumSlug = albums[currentIndex - 1].slug;
      navigate(`/album/${prevAlbumSlug}`);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev); // Toggle play/pause state
    setShowModal(!showModal); // Open/close modal based on play/pause state
  };

  useEffect(() => {
    // Calculate progress based on the current album's index
    const currentIndex = albums.findIndex(a => a.slug === albumSlug);
    if (albums.length > 0 && currentIndex >= 0) {
      setProgress(((currentIndex + 1) / albums.length) * 100); // Calculate progress percentage
    }
  }, [albumSlug, albums]);

  // Play or pause the audio based on isPlaying state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play(); // Play audio
      } else {
        audioRef.current.pause(); // Pause audio
      }
    }
  }, [isPlaying]);

  // Set audio volume based on volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set audio volume
    }
  }, [volume]);

  return (
    <Footer
      container
      className=" dark:bg-[#000000] 
      dark:text-[#ffffff] fixed bottom-0 z-50 flex items-center justify-center p-3"
    >
      <audio ref={audioRef} src={album?.audio} /> {/* Audio element */}
      <div className="flex gap-5 items-center basis-1/3">
        <img src={album?.cover} className="max-w-xs relative object-cover h-[60px] w-[60px] rounded-sm" />
        <div className="">
          <p className="text-sm font-semibold">{album?.title}</p>
          <p className="text-sm font-normal text-gray-300 line-clamp-1">{album?.description}</p>
        </div>
      </div>
      <div className="basis-1/3 items-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <FaFastBackward className="text-1xl cursor-pointer" onClick={handlePreviousAlbum} />
          <FaStepBackward className="text-1xl cursor-pointer" onClick={handlePreviousPhoto} />
          {isPlaying ? (
            <FaPauseCircle
              className="text-4xl cursor-pointer"
              onClick={togglePlayPause}
            />
          ) : (
            <FaPlayCircle
              className="text-4xl cursor-pointer"
              onClick={togglePlayPause}
            />
          )}
          <FaStepForward className="text-1xl cursor-pointer" onClick={handleNextPhoto} />
          <FaFastForward className="text-1xl cursor-pointer" onClick={handleNextAlbum} />
        </div>
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="basis-1/3 flex justify-end">
        <HiSpeakerWave />
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="w-50"
        />
      </div>
    </Footer>
  );
}
