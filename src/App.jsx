import './index.css'
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Laurels from "./components/Laurels";
import Contact from "./components/Contact";
import Navbar from './components/Navbar';

const projectData = [
  {
    imageSrc: '/img/project1.jpg',
    title: 'Project 1',
    description: 'Description for Project 1',
    tags: ['tag1', 'tag2', 'tag3']
  },
  {
    imageSrc: '/img/project2.jpg',
    title: 'Project 2',
    description: 'Description for Project 2',
    tags: ['tag4', 'tag5', 'tag6']
  }
];

function App() {

  return (
   <main className="app">   
    <Hero /> 
   <About />
   <Projects projects={projectData}/>
   <Laurels />
   <Contact />
   </main>
  )
}

export default App
