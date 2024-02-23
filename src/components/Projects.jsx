  import React from 'react'
  import ProjectCard from './ProjectCard'
  

  const Projects = ({ title, description, stack, alt, url  }) => {

    const projectDetails = [
      {
      title:"Chat-app",
      description : "A web chat application that leverages socket.io for bi-directional communication.",
      stack :["Socket.io", " ", "React.js", " ", ""],
      url: "https://github.com/vector-10/Chat-app"      
      },
      {
      title:"BlaizeMall",
      description : "A Multi vendor E-commerce platform that enables anyone buy anything.",
      stack :"socket.io",
      url: "https://github.com/vector-10/Blaize-Mall_API"   
      },
      {
      title:"Promptstore",
      description : "A web application that enables users to store and share AI prompts for search results.",
      stack :"socket.io",
      url: "https://promptstore.vercel.app/"   
      },
      {
      title:"Alexander AI",
      description : "An AI chatbot built by leveraging openAIs API for responses and research by users.",
      stack :"socket.io",
      url: "https://github.com/vector-10/Alexander-AI"   
      },

    ];

    return (  
      <div>
       <div className='project-header h-28 py-16 px-40'>
        <h1 className='introduce text-4xl font-bold block-text'> Projects </h1>
        <p className='text-md introduce1'> FullStack and backend Projects I have worked on personally.</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 '>      
        
        {projectDetails.map((project, index) => (
          <ProjectCard
            key={index}
            imageSrc={project.imageSrc}
            title={project.title}
            description={project.description}
            stack={project.stack}
            url={project.url}
          />
        ))}
        </div>      
      </div>
    
    )
  }

  export default Projects


