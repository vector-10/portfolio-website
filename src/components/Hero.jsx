import React from 'react'
import heroImage from "../assets/images/portfolio-blaize.jpg";


const Hero = () => {
    const details = {
        name: "Akalonu Chukwuduzie Blaise"
    }

  return (
    <div className="hero-section" style={{backgroundImage: `url(${heroImage})`}}>
    <div className="layer absolute inset-0 bg-gray-600 opacity-40 "></div>  
    <div className="hero-text relative text-white flex flex-col py-56 px-28">
        <h1 className="introduce text-md">Hi I'm <span className='text-orange-300'>{`${details.name}`},</span></h1>
        <h1 className="mt-5 block-text text-6xl font-bold">I'm a Software Developer</h1>
        <p className=" introduce1 mt-5">I major in Building Functional <br /> software and backend systems with JavaScript and other Technologies.</p>
       <div className='mt-10'>        
       <a href='#' className='about-button py-3 px-5 '> About Me</a> 
      </div>       
    </div>    
    </div>
  )
}

export default Hero