import React from 'react'
import ProjectCard from './ProjectCard'

const Projects = ({ title, description, stack, imageSrc, alt  }) => {

  const projectDetails = [
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    stack :"socket.io",
    imageSrc: "",
    },
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    stack :"socket.io",
    imageSrc: "",
    },
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    stack :"socket.io",
    imageSrc: "",
    },
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    stack :"socket.io",
    imageSrc: "",
    },

  ];

  return (  

    <div className='flex flex-col justify-center items-center'>
      <h1 className='p-10 font-bold block-text text-4xl'>Projects</h1>
      <div className='flex flex-col justify-center items-center'>
      {projectDetails.map((project, index) => (
        <ProjectCard
          key={index}
          imageSrc={project.imageSrc}
          title={project.title}
          description={project.description}
          stack={project.stack}
        />
      ))}
      </div>      
    </div>
  )
}

export default Projects