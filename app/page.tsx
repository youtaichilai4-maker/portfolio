import About from "./components/About";
import ChapterRail from "./components/ChapterRail";
import CoverHero from "./components/CoverHero";
import Experiences from "./components/Experiences";
import Navigation from "./components/Navigation";
import Skills from "./components/Skills";
import SplitCompileHero from "./components/SplitCompileHero";

export default function Home() {
    return (
        <main className="relative bg-slate-ink min-h-screen">
            <ChapterRail />
            <div className="relative z-10">
                <Navigation />
                <div id="cover">
                    <CoverHero />
                </div>
                <div id="hero">
                    <SplitCompileHero />
                </div>
                <About />
                <Skills />
                <Experiences />
            </div>
        </main>
    );
}
