import React from 'react'
import heroImage from "../assets/images/portfolio-blaize.jpg";


const Hero = () => {
    const details = {
        name: "Akalonu Chukwuduzie Blaise"
    }

  return (
    <div className='hero-section w-11/12 '>
       <div className="hero-text relative text-white flex flex-col md:py-56 md:px-28 pt-32">
        <h1 className="introduce text-lg md:text-md">Hi I'm <span className='text-orange-300'>{`${details.name}`},</span></h1>
         <h1 className="mt-5 block-text text-4xl md:text-6xl font-bold">I'm a Software Engineer</h1>
         <p className=" introduce1 mt-5">With over 3 years of Experience, <span className='text-orange-400'> I major in Building Functional software and </span> <br /> backend systems with Python and JavaScript.</p>
       <div className='mt-10'>        
       <a href='/about' className='about-button py-3 px-5 '> About Me</a> 
       </div>       
     </div>         

    </div>   
  )
}

export default Hero

