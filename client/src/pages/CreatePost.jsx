import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleUploadImage();
    }
  }, [file]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      )
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      } 
    } catch (error) {
      setPublishError("Something went wrong");
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl text-center my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput 
            type="text" 
            id="title" 
            placeholder="Title" 
            required 
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
          <TextInput 
            type="text" 
            id="author" 
            placeholder="Author" 
            required 
            onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
          />
        </div>
        <div className="flex gap-4 items-center justify-between border-4
        border-teal-500 border-dotted p-3">
          <FileInput 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files[0])}
          />
          {imageUploadProgress && (
            <div className="w-16 h-16">
              <CircularProgressbar 
                value={imageUploadProgress} 
                text={`${imageUploadProgress || 0}%`} 
              />
            </div>
          )}
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && 
          <img 
            className="w-full h-72 object-cover" 
            src={formData.image} 
            alt="upload"/>}
        <ReactQuill 
          theme="snow" 
          placeholder="Write something..." 
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button 
          type="submit" 
          color=""
          className="w-full bg-[#1DB954] text-white hover:bg-[#1aa94c]"
        >
          Publish 
        </Button>
        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  )
}
