import { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Palette } from 'color-thief-react';
import { Modal } from "flowbite-react";
import { PhotoContext } from '../PhotoContext';
import FooterCom from '../components/Footer';

const isNearBlackOrWhite = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 45 || brightness > 225;
};

export default function AlbumPage() {
  const { albumSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [album, setAlbum] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { currentPhotoIndex, setCurrentPhotoIndex } = useContext(PhotoContext);
  const [volume, setVolume] = useState(1); // Volume state
  const audioRef = useRef(null); // Reference for the audio element

  useEffect(() => {
    const fetchAlbum = async () => {
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
        setCurrentPhotoIndex(0);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumSlug, setCurrentPhotoIndex]);

  // Effect to update the audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set audio volume
    }
  }, [volume]);

  return (
    <main className="flex flex-col pb-40 min-h-screen">
      <div className="w-full h-100 mb-20">
        <Palette src={album?.cover} crossOrigin="anonymous" format="hex" colorCount={5}>
          {({ data }) => {
            let chosenColor = data && data[0];
            if (chosenColor && isNearBlackOrWhite(chosenColor) && data[1]) {
              chosenColor = data[1];
            }
            return (
              <div
                className="absolute w-full h-full"
                style={{
                  background: chosenColor
                    ? `linear-gradient(to bottom, ${chosenColor}, transparent)`
                    : 'transparent',
                }}
              ></div>
            );
          }}
        </Palette>
        <div className="relative name flex p-10 space-x-20">
          <img src={album?.cover} className="max-w-xs relative object-cover h-50 w-50 rounded-md" />
          <div className="text-base font-semibold space-y-2 py-20">
            <p className="text-7xl font-bold">{album?.title}</p>
            <p>{album?.description}</p>
            <p>{album && new Date(album.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="columns-3 w-full px-20">
        {album?.photos.map((photo, index) => (
          <div
            key={photo._id}
            className="mb-4 relative flex"
          >
            <img
              src={photo.image}
              className="w-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>

      {album?.photos && (
        <Modal
          show={showModal}
          size="3xl"
          onClose={() => setShowModal(false)}
          className='z-40'
        >
          <Modal.Body>
            <div className="flex justify-center">
              <img src={album.photos[currentPhotoIndex]?.image} className="object-cover rounded-md max-h-96" />
            </div>
            <div className="text-center mt-4">
              <p className="text-xl font-semibold">
                {album.photos[currentPhotoIndex]?.caption}
              </p>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <FooterCom showModal={showModal} setShowModal={setShowModal} />
    </main>
  );
}
