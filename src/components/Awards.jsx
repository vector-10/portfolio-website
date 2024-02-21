import React from 'react'
import devfest from "../assets/images/devfest.jpg"
import hack4futo from"../assets/images/hack4futo.jpg"

const Laurels = () => {
  return (
    <div>
      <div className='awards-header h-28 px-40 py-16'>
        <h1 className='introduce text-4xl font-bold block-text'>Awards and Events</h1>
        <p className='text-md introduce1'>Hackathons and Events I have Won/Attended.</p>
      </div>
      <div className='m-10 flex flex-col justify-center items-center'>    
    <figure className="md:flex rounded-l p-8 md:p-0 ">
      <img className="w-24 h-24 md:w-60 md:h-auto md:rounded-none rounded-full mx-auto" src={hack4futo} alt="awards and events" />
      <div className="pt-6 md:p-8 text-center md:text-left space-y-4">          
        <figcaption className="font-medium">
          <div className="text-lg block-text">
            Hack4Futo Hackathon
          </div>
        </figcaption>
        <blockquote>
            <p className="text-md font-medium w-70">
             Together with my team members, I won the biggest Hackathon is South-East Nigeria in 2023. 
          </p>
        </blockquote>        
          <ul className='flex text-sm introduce'>
            <li className='p-2'>Next.js</li>
            <li className='p-2'>Node.js</li>
            <li className='p-2'>Socket.io</li>
          </ul>        
      </div>
    </figure>    
    {/* second card */}
    <figure className="md:flex rounded-l p-8 md:p-0 m-10 ">
      <img className="w-24 h-24 md:w-60 md:h-auto md:rounded-none rounded-full mx-auto" src={devfest} alt="projects" />
      <div className="pt-6 md:p-8 text-center md:text-left space-y-4">          
        <figcaption className="font-medium">
          <div className="text-lg block-text">
            DevFest Owerri 2023
          </div>
        </figcaption>
        <blockquote>
            <p className="text-md font-medium w-70 ">
             I volunteered in the for Devfest and equally gave a speech on Web Socket Communication.
          </p>
        </blockquote>        
          <ul className='flex text-sm introduce '>
            <li className='p-2'>websockets</li>
            <li className='p-2'>public speaking</li>
            <li className='p-2'>volunteering</li>
          </ul>        
      </div>
    </figure>    
   </div>
    </div>
  )
}

export default Laurels


