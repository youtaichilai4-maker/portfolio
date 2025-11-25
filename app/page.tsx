import About from "./components/About";
import DataFlowBackground from "./components/DataFlowBackground";
import Experiences from "./components/Experiences";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Skills from "./components/Skills";

export default function Home() {
    return (
        <main className="relative">
            {/* 背景のデータフローアニメーション（z-0） */}
            <DataFlowBackground />

            {/* メインコンテンツ（z-10以上でDataFlowBackgroundの上に表示） */}
            <div className="relative z-10">
                <Navigation />
                <Hero />
                <About />
                <Skills />
                <Experiences />
            </div>
        </main>
    );
}
