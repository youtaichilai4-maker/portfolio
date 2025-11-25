import About from "./components/About";
import Experiences from "./components/Experiences";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Skills from "./components/Skills";

export default function Home() {
    return (
        <main className="relative">
            <Navigation />
            <Hero />
            <About />
            <Skills />
            <Experiences />
        </main>
    );
}
