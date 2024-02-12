import React from 'react'
import aboutImage from "../assets/images/about.jpg"

const About = () => {
  return (
    <div className='about-section '>
      <div className='about-header pt-20 pl-40'>
        <h1 className='introduce text-3xl font-bold'>About Me</h1>
        <p className='text-lg'>A brief description of Myself and Skillset.</p>
      </div>
     <div className='flex items-center justify-evenly'>
     <div className='about-image pt-10'>
       <img src={aboutImage} alt='about me' className='about-image1' width={300} height={700}/>
       </div>
 
       <div className='about-text w-1/2 '>
        <p> <span className='font-bold introduce1 text-lg'> I am Akalonu Chuwkwuduzie Blaise, </span>
          <br />A software developer who specializes in building web applications and has an eye for meaningful projects that solve problems.
          I work with the MERN( MongoDB, Express.js, React.js and Node.js) to build software with good user interfaces and functional server APIs, 
          I have had the privilege of working for two Startups where I played a key role in developing and launching cutting-edge applications.
          With my great attention to detail, I always ensure that all projects are completed to full accuracy
        </p>
 
       </div>
     </div>

    </div>
  )
}

export default About