import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react'

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 mt-14 px-3 max-w-6xl mx-auto '>
        <div className='text-center font-bold text-lg'>
          <h1 className='text-2xl font-bold lg:text-6xl text-center mb-5'>🌟 Welcome to OURS Blog! 🌟</h1>
          <span className='border-b-2'>
            {currentUser && currentUser.username.toUpperCase().charAt(0) + currentUser.username.slice(1)}
          </span>
        </div>
        <p className='text-gray-500 dark:text-gray-300 text-justify'>
          Take a moment to browse through our diverse collection of blog on topics such as
          web development, software engineering and programming languages. Each one a unique
          journey waiting to be discovered. From personal reflections to insightful commentary,
          there's something here for everyone. And if you feel inspired to share your own story,
          we invite you to join our community of writers and contribute your voice to the chorus of
          narratives that make up our digital tapestry.
        </p>
        <div className=' flex justify-center p-5 space-x-4 md:space-x-8'>
          <Link
            to='/search'>
            <Button
              gradientDuoTone="purpleToBlue"
              className="w-auto mb-4 "
              outline> View all posts </Button>
          </Link>

          {
            currentUser ? (
              <Link to={'/create-post'}>
                <Button type="submit"
                  gradientDuoTone="purpleToBlue"
                  className="w-auto mb-4"
                  outline >Create a post here</Button>
              </Link>
            ) : (
              <Link to="/dashboard?tab=profile">
                <Button type="submit"
                  gradientDuoTone="purpleToBlue"
                  className="w-auto mb-4 "
                  outline>Create a post </Button>
              </Link>
            )
          }
        </div>

      </div>
      <div className='p-3 bg-blue-50 dark:bg-slate-700 max-w-6xl mx-auto'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 pt-10'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4 justify-center md:justify-start items-center'>
              {posts.map((post) => (
                <div key={post._id} >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
            <Link
              to='/search'>
              <div className="flex justify-center w-full mt-8">
                <Button
                  type="submit"
                  outline
                  gradientDuoTone="purpleToBlue"
                > View more posts
                </Button>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
