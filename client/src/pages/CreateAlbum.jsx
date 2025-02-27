import { Button, FileInput, TextInput } from "flowbite-react";
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAlbum() {
  const [files, setFiles] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    photos: [],
    audio: ''
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/album/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/album/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  // Handle image file uploads when the files array changes
  useEffect(() => {
    if (files.length > 0) {
      handleUploadImages();
    }
  }, [files]);

  // Handle cover image upload when it changes
  useEffect(() => {
    if (coverImage) {
      handleUploadCoverImage();
    }
  }, [coverImage]);

  // Handle audio file upload when it changes
  useEffect(() => {
    if (audioFile) {
      handleUploadAudio();
    }
  }, [audioFile]);

  const uploadFile = async (file, type) => {
    try {
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name; // Unique file name
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(prev => ({
            ...prev,
            [fileName]: progress.toFixed(0),
          }));
        },
        (error) => {
          // Handle unsuccessful uploads
          setImageUploadError(type === 'cover' ? "Cover image upload failed" : type === 'audio' ? "Audio upload failed" : "Image upload failed");
          console.error("Upload error:", error);
        },
        () => {
          // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(prev => ({
              ...prev,
              [fileName]: 100,
            }));
            if (type === 'cover') {
              setFormData(prev => ({
                ...prev,
                cover: downloadURL,
              }));
            } else if (type === 'audio') {
              setFormData(prev => ({
                ...prev,
                audio: downloadURL, // Update formData with audio URL
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, { image: downloadURL, caption: '' }],
              }));
            }
          });
        }
      );
    } catch (error) {
      setImageUploadError(type === 'cover' ? "Cover image upload failed" : type === 'audio' ? "Audio upload failed" : "Image upload failed");
      console.error("Error uploading file:", error);
    }
  };

  const handleUploadCoverImage = async () => {
    if (coverImage) {
      await uploadFile(coverImage, 'cover');
    }
  };

  const handleUploadAudio = async () => {
    if (audioFile) {
      await uploadFile(audioFile, 'audio'); // Handle audio upload
    }
  };

  const handleUploadImages = async () => {
    const uploadPromises = files.map((file) => uploadFile(file, 'photos'));
    await Promise.all(uploadPromises);
  };

  const handleCaptionChange = (index, caption) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((photo, i) => (i === index ? { ...photo, caption } : photo)),
    }));
  };

  return (
    <div className="create-album flex">
      <div className="left-side w-1/2 pr-4">
        <h2>Create album</h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            id="title"
            placeholder="Title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextInput
            type="text"
            id="description"
            placeholder="Description"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextInput
            type="text"
            id="location"
            placeholder="Location"
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <FileInput 
            type="file" 
            accept="image/*" 
            onChange={(e) => setCoverImage(e.target.files[0])} // File input for cover image
          />
          <FileInput 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={(e) => setFiles(Array.from(e.target.files))} // File input for multiple images
          />
          <FileInput 
            type="file" 
            accept="audio/*" 
            onChange={(e) => setAudioFile(e.target.files[0])} // File input for audio file
          />
          <Button 
            type="submit" 
            color=""
            className="w-full bg-[#1DB954] text-white hover:bg-[#1aa94c]"
          > 
            Post
          </Button>
          {publishError && <p className="text-red-500 mt-2">{publishError}</p>}
        </form>
      </div>
      <div className="right-side w-1/2 pl-4">
        <h2>Uploaded Images</h2>
        <div className="image-grid grid grid-cols-2 gap-4">
          {formData.photos.map((photo, index) => (
            <div key={index} className="image-item">
              <div className="relative">
                <img
                  src={photo.image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-40 object-cover mb-2"
                />
              </div>
              <TextInput
                type="text"
                placeholder="Add caption"
                value={photo.caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
