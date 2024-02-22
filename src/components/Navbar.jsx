import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation

const Sidebar = () => {
  return (
    <div className=" h-screen  bg-gray-900 text-white">
      <ul className='flex flex-col items-center pt-10'>
        <li className='py-3'>Home</li>
        <li className='py-3'>About</li>
        <li className='py-3'>Projects</li>
        <li className='py-3'>Awards</li>
        <li className='py-3'>Contact</li>        
      </ul>
    </div>
  );
};

export default Sidebar;
