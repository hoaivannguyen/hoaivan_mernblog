import Album from "../models/album.model.js";

// Create a new album
export const createalbum = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create albums"));
  }

  if (!req.body.title) {
    return next(errorHandler(400, "Please provide a title for the album"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newAlbum = new Album({
    ...req.body, slug, userId: req.user.id
  });
  try {
    const savedAlbum = await newAlbum.save();
    res.status(200).json(savedAlbum);
  } catch (error) {
    next(error);
  }
}

export const getalbums = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const albums = await Album.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.location && { category: req.query.location}),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.albumId && { _id: req.query.albumId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ] 
      })
    }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

    const totalAlbums = await Album.countDocuments()

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() -1,
      now.getDate(),
    )

    const lastMonthAlbums = await Album.countDocuments ({
      createdAt: { $gte: oneMonthAgo }
    })
    res.status(200).json({ albums, totalAlbums, lastMonthAlbums });
  } catch (error) {
    next(error);
  }
};

export const deletealbum = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this album"));
  }
  try {
    await Album.findByIdAndDelete(req.params.albumId);
    res.status(200).json("Album has been deleted");
  } catch (error) {
    next(error);
  }
}
