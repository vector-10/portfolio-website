import './index.css'
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Laurels from "./components/Laurels";
import Contact from "./components/Contact";
import Navbar from './components/Navbar';



function App() {

  return (
   <main className="app">   
    <Hero /> 
   <About />
   <Projects />
   <Laurels />
   <Contact />
   </main>
  )
}

export default App
