import React from 'react'
import aboutImage from "../assets/images/about.jpg"

const About = () => {
  return (
    <div className='about-section flex flex-col w-11/12'>
      <div className='about-header h-28 py-16  px-40'>
        <h1 className='introduce text-4xl font-bold block-text '>About Me</h1>
        <p className='text-md introduce1'>A brief description of Myself and Skillset.</p>
      </div>
     <div className='flex flex-col md:flex-row md:flex-wrap items-center justify-evenly '>
     <div className='about-image pt-10'>
       <img src={aboutImage} alt='about me' className='about-image1' width={300} height={700}/>
       </div>
 
       <div className='about-text w-1/2 pt-10  text-sm'>
        <p> <span className='font-bold introduce1 text-md'> I am Akalonu Chuwkwuduzie Blaise, </span>
          <br />A software developer who specializes in building web applications and has an eye for meaningful projects that solve problems.
          I work with the MERN stack (MongoDB, Express.js, React.js and Node.js) to build software with good user interfaces and functional server APIs, 
          I have had the privilege of working for two Startups where I played a key role in developing and deploying cutting-edge applications.
          With my great attention to detail, I always ensure that all projects are completed to full accuracy.
          <br />
         <p className='mt-5'> I have participated in and won the Biggest Hackthon in the South-East Hack4Futo, as a proof of competence.</p>
        </p> 
       </div>
     </div>

    </div>
  )
}

export default About