import React from 'react'
import ProjectCard from './ProjectCard'

const Projects = ({ projects }) => {
  return (
    <div className='project-component'>
      {projects.map((project, index) => {
        <ProjectCard 
        key={index}
        imageSrc={project.imageSrc}
        title={project.title}
        description={project.description}
        tags={project.tags}/>
      })}
    </div>
  )
}

export default Projects