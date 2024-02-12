"use client"
import Image from "next/image";


const Hero = () => {
  return (
    <div className='hero-section'>
        <Image 
         src="/assets/images/portfolio.jpg"
         width={500}
         height={500}
         alt="Picture of Chukwuduzie Blaise"
        />
    </div>
  )
}

export default Hero