import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <div className="theme-a">
      <Nav />
      <Hero />
      <Projects />
      <About />
      <Contact />
    </div>
  );
}
