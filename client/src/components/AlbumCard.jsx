import { Link } from 'react-router-dom';

export default function AlbumCard({ album }) {
  const date = new Date(album.updatedAt);

  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear()
  return (
    <Link to={`/album/${album.slug}`} 
    className='group relative p-5 h-[400px] overflow-hidden rounded-lg w-[280px] transition-all
 hover:bg-neutral-200 dark:hover:bg-[#1f1f1f]'>
      <div className='flex justify-center'>
        <img 
          src={album.cover} 
          alt="album cover" 
          className="h-[250px] w-[250px]transition-all duration-300 rounded-md object-cover"
        />
      </div>
      <div className="p-2 flex flex-col">
        <p className='text-lg font-medium'>{album.title}</p>
        <span className='text-sm text-gray-400 font-medium'>{album.location} • {month} {year}</span>
      </div>
    </Link>
  )
}
