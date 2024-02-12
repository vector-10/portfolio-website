import React from 'react'
import heroImage from "../assets/images/portfolio-blaize.jpg";


const Hero = () => {
    const details = {
        name: "Akalonu Chukwuduzie Blaise"
    }

  return (
    <div className="hero-section" style={{backgroundImage: `url(${heroImage})`}}>
    <div className="layer absolute inset-0 bg-gray-600 opacity-60 "></div>  
    <div className="hero-text relative text-white flex flex-col py-56 px-28">
        <h1 className="introduce text-md">Hi I'm {`${details.name}`},</h1>
        <h1 className="py-5 introduce1 text-5xl font-bold">I'm a Software Developer</h1>
        <p className=" introduce1">I major in building Backend Development <br />of Web Applications with the Node.js (Express.js).</p>
        <button>About Me</button>        
    </div>    
    </div>
  )
}

export default Hero