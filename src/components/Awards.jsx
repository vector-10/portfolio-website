import React from 'react'
import portfolio from "../assets/images/portfolio-blaize.jpg";

const Laurels = () => {
  return (
    <div>
      <div className='awards-header h-28 px-40 py-16'>
        <h1 className='introduce text-4xl font-bold block-text'>Awards and Events</h1>
        <p className='text-md introduce1'>Hackathons and Events I have Won/Attended.</p>
      </div>
      <div className='m-10 flex flex-col justify-center items-center'>    
    <figure className="md:flex shadow-md rounded-l p-8 md:p-0 ">
      <img className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src={portfolio  } alt="projects" width="384" height="512"/>
      <div className="pt-6 md:p-8 text-center md:text-left space-y-4">          
        <figcaption className="font-medium">
          <div className="text-lg block-text">
            Hack4Futo Hackathon
          </div>
        </figcaption>
        <blockquote>
            <p className="text-md font-medium w-60">
             A Hackathon I won with my team of 4 in 2023
          </p>
        </blockquote>        
          <ul className='flex font-bold introduce '>
            <li className='p-2'>Next.js</li>
            <li className='p-2'>Node.js</li>
            <li className='p-2'>Socket.io</li>
          </ul>        
      </div>
    </figure>    
   </div>
    </div>
  )
}

export default Laurels


