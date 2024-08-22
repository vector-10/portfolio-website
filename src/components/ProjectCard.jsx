import React from 'react'
import { Link } from "react-router-dom"

const ProjectCard = ({ title, description, stack, url }) => {
    // created props of imagesrc, title, description and tags for reusability
  return (
   <div>
      <figure className="md:flex p-8 md:p-0 md:w-11/12 ">
       <div className="pt-6 md:p-6 md:px-40 text-center md:text-left space-y-4">          
        <figcaption className="font-medium">
          <div className="text-lg block-text">
            {title}
          </div>
        </figcaption>
        <blockquote>
            <p className="text-md font-medium w-70">
             {description}
          </p>
        </blockquote>        
          <ul className='flex text-sm introduce'>
            <li className='p-2 '>{stack}</li>
            
          </ul> 
              <Link  className="github-link bg-orange-400 p-2 text-xs " to={url}> Github Link</Link>
      </div>
    </figure>    
   </div>
  )
}

export default ProjectCard






// <figure class="md:flex shadow-md rounded-l p-8 md:p-0 m-5">
// <img class="w-24 h-24 md:w-64 md:h-auto md:rounded-none rounded-full mx-auto" src={imageSrc} alt="projects"/>
// <div class="pt-6 md:p-8 text-center md:text-left space-y-4">          
//   <figcaption class="font-medium">
//     <div class="text-lg block-text">
//       {title}
//     </div>
//   </figcaption>
//   <blockquote>
//       <p class="text-md font-medium w-80">
//        {description}
//     </p>
//   </blockquote>        
//     <ul className='flex font-bold introduce '>
//       <li className='p-2'>{stack}</li>
//       <li className='p-2'>{stack}</li>
//       <li className='p-2'>{stack}</li>
//     </ul>        
// </div>
// </figure>    