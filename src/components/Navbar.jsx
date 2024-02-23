import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation

const Sidebar = () => {
  return (
    <div className=" h-screen  bg-gray-900 text-white">
      <ul className='flex flex-col items-center pt-10 text-xl'>
        <li className='py-3 nav-item '><Link to="/">Home</Link></li>
        <li className='py-3 nav-item '><Link to="/about">About</Link></li>
        <li className='py-3 nav-item '><Link to="/projects">Projects</Link></li>
        <li className='py-3 nav-item '><Link to="/awards">Awards</Link></li>
        <li className='py-3 nav-item '><Link to="/contact">Contact</Link></li>        
      </ul>
    </div>
  );
};

export default Sidebar;
