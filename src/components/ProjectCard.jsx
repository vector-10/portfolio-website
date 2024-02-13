import React from 'react'

const ProjectCard = ({ title, description, tag }) => {
    // created props of imagesrc, title, description and tags for reusability
  return (
    <div className='project-card'>
     <div className='project-component'>
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
    <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"/>
      <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">{title}</div>
    <p className="text-gray-700 text-base">
     {description}
    </p>
  </div>
  <div className="px-6 pt-4 pb-2">
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
  </div>
</div>
    </div>
    </div>
  )
}

export default ProjectCard