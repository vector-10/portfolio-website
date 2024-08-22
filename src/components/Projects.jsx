  import React from 'react'
  import ProjectCard from './ProjectCard'
  

  const Projects = ({ title, description, stack, alt, url  }) => {

    const projectDetails = [
      {
      title:"Frysk Protocol",
      description : "A fiat-on-ramp user interface that leverages the Fraxtal protocol eo enable users purchase crypto with fiat currency.",
      stack :["Chainlink", " ", "React.js", " ", "Node.js"],
      url: "https://fiat-on-ramp.vercel.app/"      
      },
      {
      title:"BlaizeMall",
      description : "A Multi vendor E-commerce platform enabling all entities from brands to corporate organizations to digitize their commercial activities.",
      stack :["Redux", " ", "React.js", " ", "Node.js"],
      url: "https://github.com/vector-10/Blaize-Mall_API"   
      },
      {
      title:"Promptstore",
      description : "A comprehensive web application tha enables users create, store and share prompts in real-time for the specific results from LLM's onlilne.",
      stack :["Next.js", " ", "React.js", " ", "Node.js"],
      url: "https://promptstore.vercel.app/"   
      },
      {
      title:"School Aid",
      description : "A comprehensive school management software that incorporates all services to run an academic institution online, with email marketing, result organization and more",
      stack :["OPEN AI", " ", "React.js", " ", "Node.js"],
      url: "https://github.com/vector-10/Alexander-AI"   
      },

    ];

    return (  
      <div>
       <div className='project-header h-28 py-16 px-40'>
        <h1 className='introduce text-4xl font-bold block-text'> Projects </h1>
        <p className='text-md introduce1'> Profesional Software i have built to solve certain problems I observed.</p>
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


