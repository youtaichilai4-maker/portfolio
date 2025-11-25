import About from "./components/About";
import ElectricBackground from "./components/ElectricBackground";
import Experiences from "./components/Experiences";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Skills from "./components/Skills";

export default function Home() {
    return (
        <main className="relative">
            <ElectricBackground />
            <Navigation />
            <Hero />
            <About />
            <Skills />
            <Experiences />
        </main>
    );
}
