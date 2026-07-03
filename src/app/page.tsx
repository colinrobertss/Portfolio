import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import IntroOverlay from "@/components/IntroOverlay";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Footer />
      <IntroOverlay />
    </>
  );
}
