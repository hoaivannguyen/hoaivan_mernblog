import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <Link to={`/post/${post.slug}`} className='group relative p-5  h-[400px] hover:bg-neutral-200 dark:hover:bg-[#1f1f1f]
    overflow-hidden rounded-md max-w-5xl transition-all'>
      <div className='flex gap-5'>
        <img 
          src={post.image} 
          alt="post cover" 
          className="h-[250px] w-[250px] transition-all duration-300 rounded-lg object-cover"
        />
        <div className="p-2 flex flex-col">
          <p className='text-lg font-medium'>{post.title}</p>
          <span className='text-sm text-gray-400 font-medium'>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className='text-sm text-gray-400 font-medium'>{post.author}</span>
          <div 
            className="line-clamp-3 text-sm text-gray-400 font-medium post-content pt-5"
            dangerouslySetInnerHTML={{__html: post && post.content}}
          >
          </div>
        </div>
      </div>
    </Link>
  )
}
