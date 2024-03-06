import React from 'react'
import CallToAction from '../components/CallToAction'
const Projects = () => {
  return (
    <div className=' max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 mt-14 px-3'>
      <h1 className='text-2xl font-semibold'>Pojects</h1>
      <p className='text-md text-gray-500 dark:text-gray-300 '>Enjoy with multiple choice questions and answers of HTML, CSS, Reactjs, NodeJs, Jquery and JavaScript!</p>
      <CallToAction />
    </div>
  )
}

export default Projects
