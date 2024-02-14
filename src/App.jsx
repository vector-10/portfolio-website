import './index.css'
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Awards from "./components/Awards";
import Contact from "./components/Contact";




function App() {

  return (
   <main className="app">   
    <Hero /> 
   <About />
   <Projects />
   <Awards />
   <Contact />
   </main>
  )
}

export default App
