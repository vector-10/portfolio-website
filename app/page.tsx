import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { WorkExperience } from "@/components/work-experience";
import { TechStack } from "@/components/tech-stack";
import { Projects } from "@/components/projects";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <WorkExperience />
      <TechStack />
      <Projects />
      <Contact />
    </>
  );
}
