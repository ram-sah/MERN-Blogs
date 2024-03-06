import React from 'react'
import { Button } from 'flowbite-react';

const CallToAction = () => {
    return (
        <div className='flex flex-col sm:flex-row p-3 border border-purple-500 justify-center items-center rounded-tr-3xl rounded-bl-3xl text-center '>
            <div className="flex-1 justify-center flex flex-col">
                <h2 className='text-2xl'>
                    Want to Practice Multiple Choice Questions?
                </h2>
                <p className='text-gray-400 my-2'>
                    Checkout these resources.
                </p>
                <Button gradientDuoTone='purpleToBlue' className='rounded-tr-xl rounded-br-none'>
                    <a href="https://ram-sah.github.io/LinkedIn-Assessments/" target='_blank' rel='noopener noreferrer'>
                        Linkedin test practice 320+ questions
                    </a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <a href='https://ram-sah.github.io/LinkedIn-Assessments' target='_blank' rel='noopener noreferrer'>
                <img src="https://www.htmlpanda.com/blog/wp-content/uploads/2022/05/A-Guide-on-ReactJS-Web-Development-1.png" className='rounded-tr-3xl rounded-bl-3xl bg-slate-400'/>
                </a>
            </div>
        </div>
      )
}

export default CallToAction;
