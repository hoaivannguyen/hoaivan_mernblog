import mongoose from "mongoose";

// Define the schema for a Photo Album
const albumSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cover: {
        type: String,
        default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: '',
    },
    location: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    photos: [{
      image: {
        type: String,
        required: true,
      },
      caption: {
        type: String,
        default: '',
      },
    }],
    audio: {
      type: String,
    },
  }, { timestamps: true }
);

// Create model from the schema
const Album = mongoose.model('Album', albumSchema);

// Export the model
export default Album;
