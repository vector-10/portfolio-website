import React from 'react'

const ProjectCard = ({ title, description, imageSrc, stack }) => {
    // created props of imagesrc, title, description and tags for reusability
  return (
   <div>
    <figure class="md:flex shadow-md rounded-l p-8 md:p-0 ">
      <img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src={imageSrc} alt="projects" width="384" height="512"/>
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">          
        <figcaption class="font-medium">
          <div class="text-lg block-text">
            {title}
          </div>
        </figcaption>
        <blockquote>
            <p class="text-md font-medium w-60">
             {description}
          </p>
        </blockquote>        
          <ul className='flex font-bold introduce '>
            <li className='p-2'>{stack}</li>
            <li className='p-2'>{stack}</li>
            <li className='p-2'>{stack}</li>
          </ul>        
      </div>
    </figure>    
   </div>
  )
}

export default ProjectCard




// <div className='project-card'>
// <div className='project-component'>
//  <div class="max-w-sm rounded overflow-hidden shadow-lg">
// <img class="w-full" src={imageSrc} alt={alt}/>
//  <div className="px-6 py-4">
// <div className="font-bold text-xl mb-2">{title}</div>
// <p className="text-gray-700 text-base">
// {description}
// </p>
// </div>
// <div className="px-6 pt-4 pb-2">
// <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
// <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
// <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
// </div>
// </div>
// </div>
// </div>


