import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner, Button } from 'flowbite-react';
import CallToAction from '../components/CallToAction';

const PostPage = () => {
  // Extract the value of 'postSlug' from the URL parameters
  const { postSlug } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)

  // useEffect hook to fetch post data when 'postSlug' changes or component mounts
  useEffect(() => {
    // Define an asynchronous function to fetch post data
    const fetchPost = async () => {
      try {
        setLoading(true); // Set loading state to true
        // Fetch post data from an API endpoint using the postSlug
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json(); // Parse the response as JSON
        if (!res.ok) {
          // If response is not ok, set error state to true and loading to false
          setError(true);
          setLoading(false);
          return;
        }
        // If response is ok, set the post state to the first post in the response data
        setPost(data.posts[0]);
        setLoading(false); // Set loading state to false
        setError(false); // Set error state to false
      } catch (error) {
        setError(true); // If an error occurs, set error state to true
        setLoading(false); // Set loading state to false
      }
    };
    fetchPost(); // Call the fetchPost function
  }, [postSlug]); // Depend on postSlug to trigger useEffect when it changes

  // If loading state is true, render a Spinner component
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    )
  };

  // If loading is false, render the post details
  return (
    <>
      <main className='p-3 flex flex-col max-w-4xl mx-auto min-h-screen'>
        {/* Render post title */}
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
        {/* Render a button with a link to search by post category */}
        <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
          <Button size='xs' pill >{post && post.category}</Button>
        </Link>
        {/* Render post image */}
        <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
        {/* Render post details */}
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
          {/* Render post creation date */}
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          {/* Render post reading time */}
          <span className='italic'>
            {/* Display "less than 1 Minute read" if post content length is less than or equal to 1000 characters, otherwise display reading time in minutes */}
            {post && post.content.length <= 1000 ? ' less than 1 Minute read' : `${(post.content.length / 1000).toFixed(0)} Minutes read`}
          </span>
        </div>
        {/* Render post content */}
        <div className='p-3 max-w-4xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>

        </div>
        <div className='max-w-4xl mx-auto w-full'>
    <CallToAction />
        </div>
      </main>
    </>
  );
}

export default PostPage
