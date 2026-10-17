import About from "./components/About";
import ChapterRail from "./components/ChapterRail";
import CoverHero from "./components/CoverHero";
import Experiences from "./components/Experiences";
import Intro from "./components/Intro";
import Navigation from "./components/Navigation";
import ScrollStage from "./components/ScrollStage";
import Skills from "./components/Skills";
import SplitCompileHero from "./components/SplitCompileHero";

export default function Home() {
    return (
        <main className="relative bg-slate-ink min-h-screen">
            <ChapterRail />
            <div className="relative z-10">
                <Navigation />
                <ScrollStage id="cover" className="scroll-mt-24">
                    <CoverHero />
                </ScrollStage>
                <ScrollStage>
                    <Intro />
                </ScrollStage>
                <ScrollStage id="hero" className="scroll-mt-24">
                    <SplitCompileHero />
                </ScrollStage>
                <ScrollStage>
                    <About />
                </ScrollStage>
                <ScrollStage>
                    <Skills />
                </ScrollStage>
                {/* Experiences stage each pane individually (they're taller than the viewport). */}
                <Experiences />
            </div>
        </main>
    );
}
