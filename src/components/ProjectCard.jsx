import React from 'react'

const ProjectCard = ({ title, description, imageSrc, stack }) => {
    // created props of imagesrc, title, description and tags for reusability
  return (
   <div>
    <figure class="md:flex shadow-md rounded-l p-8 md:p-0 m-5">
      <img class="w-24 h-24 md:w-64 md:h-auto md:rounded-none rounded-full mx-auto" src={imageSrc} alt="projects"/>
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">          
        <figcaption class="font-medium">
          <div class="text-lg block-text">
            {title}
          </div>
        </figcaption>
        <blockquote>
            <p class="text-md font-medium w-80">
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






