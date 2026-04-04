import About from "./components/About";
import CustomCursor from "./components/CustomCursor";
import ElectromagneticBackground from "./components/ElectromagneticBackground";
import Experiences from "./components/Experiences";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Skills from "./components/Skills";

export default function Home() {
    return (
        <main className="relative">
            {/* グラデーションメッシュ背景 */}
            <div className="gradient-mesh" />

            {/* ノイズテクスチャ */}
            <div className="noise-overlay" />

            {/* Three.js 電磁波背景 */}
            <ElectromagneticBackground />

            {/* カスタムカーソル */}
            <CustomCursor />

            {/* メインコンテンツ（z-10以上で背景の上に表示） */}
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
