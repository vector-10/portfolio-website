import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

const Sidebar = () => {
  return (
    <div className=" h-screen bg-gray-900 text-white flex flex-col">
      <ul className='flex flex-col items-center pt-10 text-xl'>
        <li className='py-3 nav-item '><Link to="/">Home</Link></li>
        <li className='py-3 nav-item '><Link to="/about">About</Link></li>
        <li className='py-3 nav-item '><Link to="/projects">Projects</Link></li>
        <li className='py-3 nav-item '><Link to="/awards">Awards</Link></li>
        <li className='py-3 nav-item '><Link to="/contact">Contact</Link></li>        
      </ul>

      <ul className='flex flex-col items-center mt-5'>
        <a href='https://github.com/vector-10'><li className='nav-icon'><GitHubIcon style={{ fontSize: "35" }}/></li></a>
        <a href='https://www.linkedin.com/in/chukwuduzie-akalonu-46811026b/'><li className='nav-icon'><LinkedInIcon style={{ fontSize: "35" }}/></li></a>
        <a href='https://twitter.com/vector_ware'><li><XIcon className='nav-icon' style={{ fontSize: "35",  }}/></li></a>
      </ul>
    </div>
  );
};

export default Sidebar;
