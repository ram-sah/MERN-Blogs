import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalHeader, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user)
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('')
  // console.log(userPosts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if (res.ok) {
          setUserPosts(data.posts)
          if (data.posts.length < 7) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  // handleShowMore button
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json()
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 7) {
          setShowMore(false)
        }
      }

    } catch (error) {
      console.log(error.message)
    }
  }
  //Delete posts
  const handleDeletePost = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        )
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className=' mb-4 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-400 dark:scrollbar-track-slate-500 dark:scrollbar-thumb-slate-700'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md" >
            <TableHead>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>
                <span>Edit</span>
              </TableHeadCell>
            </TableHead>
            {userPosts.map((post) => (
              <TableBody className='divide-y' key={post._id}>
                <TableRow className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 bg-slate-300 object-cover '
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link className='text-gray-900 dark:text-white' to={`post/${post.slug}`}>{post.title} </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span onClick={() => {
                      setShowModel(true);
                      setPostIdToDelete(post._id);
                    }}
                      className='text-red-500 cursor-pointer hover:underline'>
                      Delete </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className='text-teal-500 hover:underline cursor-pointer'>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {
            showMore && (
              <button className='w-full text-teal-600 self-center py-8 dark:text-white hover:underline' onClick={handleShowMore}>
                Show more...</button>
            )
          }
        </>
      ) : ("you have no post available")}

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-10 h-10 mx-auto mb-4 text-red-500 " />
            <h2 className="mb-5 text-gray-500">
              Are you sure want to delete this Post ?{" "}
            </h2>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure !
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No, cancel it.
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default DashPosts
