# Portfolio Website

A high-performance, visually stunning single-page portfolio website built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **3D / particles:** @react-three/fiber + three (GPU drift field), plus hand-rolled 2D canvas particle physics for the hero/section titles
- **Smooth scroll:** lenis
- **Icons:** lucide-react

## Design Concept

- **Theme:** "Markdown source → rendered output" — the whole site reads as a split-pane editor, dark mode only
- **Colors:** Slate-ink background (#0B0D10), Cyan (#7FE3FF), Amber (#F5A524)
- **Typography:** Fraunces (display serif), Inter Tight (body/UI), JetBrains Mono (code, labels, timestamps)
- **Visual Effects:** Drift-diffusion particle physics — the hero title assembles from a 2D canvas particle simulation with pointer-reactive spring physics, while an ambient R3F/GPU particle field (`DriftField`) drifts in the background, mounted only when its section is in view

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
portfolio/
├── app/
│   ├── components/      # React components
│   ├── data.ts         # Content data
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── public/             # Static assets
└── package.json        # Dependencies
```





