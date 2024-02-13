import React from 'react'
import ProjectCard from './ProjectCard'

const Projects = ({ title, description, tag }) => {

  const projectDetails = [
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    tag :"socket.io"
    },
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    tag :"socket.io"
    },
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    tag :"socket.io"
    },
    {
    title:"Chat-app",
    description : "A web application that leverages socket.io",
    tag :"socket.io"
    },

  ];

  return (  

    <div>
      {projectDetails.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          description={project.description}
          tag={project.tag}
        />
      ))}
    </div>
  )
}

export default Projects