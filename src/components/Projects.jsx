  import React from 'react'
  import ProjectCard from './ProjectCard'
  

  const Projects = ({ title, description, stack, alt  }) => {

    const projectDetails = [
      {
      title:"Chat-app",
      description : "A web chat application that leverages socket.io for bi-directional communication.",
      stack :"socket.io",
      
      },
      {
      title:"BlaizeMall",
      description : "A Multi vendor E-commerce platform that enables anyone buy anything.",
      stack :"socket.io",
      
      },
      {
      title:"Promptstore",
      description : "A web application that enables users to store and share AI prompts for search results.",
      stack :"socket.io",
      
      },
      {
      title:"Alexander AI",
      description : "An AI chatbot built by leveraging openAIs API for responses and research by users.",
      stack :"socket.io",
     
      },

    ];

    return (  
      <div>
       <div className='project-header h-28 py-16 px-40'>
        <h1 className='introduce text-4xl font-bold block-text'> Projects </h1>
        <p className='text-md introduce1'> FullStack and backend Projects I have worked on personally.</p>
      </div>
      <div className='flex flex-col justify-center items-center m-10'>      
        
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


