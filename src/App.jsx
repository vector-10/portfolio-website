import './index.css'
import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Awards from "./components/Awards";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";


function App() {

  return (
    <div className='app flex'>
      <div className='w-1/12'>
      <Navbar />
      </div>          
      <Routes>
      <Route path='/' element = {<Hero />}  />
      <Route path='/about' element = {<About />} />
      <Route path='/projects' element = {<Projects />} />
      <Route path='/awards' element = {<Awards />} />
      <Route path='/contact' element = {<Contact />} />
    </Routes>
    </div>
  
  )
}

export default App

