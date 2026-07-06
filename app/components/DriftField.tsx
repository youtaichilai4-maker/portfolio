"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "../hooks/useReducedMotion";

const CYAN = new THREE.Color("#7FE3FF");
const AMBER = new THREE.Color("#F5A524");

const DESKTOP_PARTICLE_COUNT = 2500;
const MOBILE_PARTICLE_COUNT = 900;
const MOBILE_BREAKPOINT_PX = 768;
const NEAR_VIEWPORT_ROOT_MARGIN = "200px";
// how far (world units) the pointer's "applied field" reaches before falloff
const POINTER_FIELD_RADIUS = 1.1;
// readability guardrail (audit finding) — no particle may render brighter than this
const MAX_PARTICLE_ALPHA = 0.55;
const CARRIER_CHANCE = 0.08;

type PointerState = { x: number; y: number; active: number };

const VERTEX_SHADER = /* glsl */ `
    uniform float uTime;
    uniform float uBoundsX;
    uniform float uBoundsY;
    uniform vec2 uPointer;
    uniform float uPointerActive;
    uniform float uPointerRadius;
    uniform float uPixelRatio;

    attribute float aSeed;
    attribute float aSpeed;
    attribute float aSize;
    attribute float aBright;
    attribute vec3 aColor;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
        vColor = aColor;

        vec3 pos = position;
        float t = uTime * aSpeed;

        // drift-diffusion streaming: slow directional drift + diffusive wobble
        pos.x += t * 0.5;
        pos.y += sin(t * 1.7 + aSeed * 6.28318) * 0.12;

        // wrap so the stream reads as continuous rather than particles vanishing
        pos.x = mod(pos.x + uBoundsX, uBoundsX * 2.0) - uBoundsX;
        pos.y = mod(pos.y + uBoundsY, uBoundsY * 2.0) - uBoundsY;

        // pointer = locally applied field: smooth inverse-distance repulsion
        vec2 toParticle = pos.xy - uPointer;
        float dist = length(toParticle);
        float falloff = smoothstep(uPointerRadius, 0.0, dist);
        vec2 dir = toParticle / max(dist, 0.0001);
        pos.xy += dir * falloff * uPointerRadius * 0.5 * uPointerActive;

        float shimmer = 0.55 + 0.45 * sin(t * 2.2 + aSeed * 9.0);
        vAlpha = (0.2 + 0.45 * aBright) * shimmer;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * uPixelRatio;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const FRAGMENT_SHADER = /* glsl */ `
    uniform float uMaxAlpha;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float core = smoothstep(0.5, 0.0, d);
        float alpha = min(vAlpha * core, uMaxAlpha);
        gl_FragColor = vec4(vColor, alpha);
    }
`;

function makeGeometry(count: number) {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const brights = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] = (Math.random() * 2 - 1) * 3.4;
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * 2.2;
        positions[i * 3 + 2] = 0;

        seeds[i] = Math.random();
        speeds[i] = 0.15 + Math.random() * 0.35;

        const isCarrier = Math.random() < CARRIER_CHANCE;
        brights[i] = isCarrier ? 1 : Math.random() * 0.5;
        sizes[i] = isCarrier ? 3.0 + Math.random() * 1.6 : 1.1 + Math.random() * 1.3;

        const c = Math.random() < 0.55 ? CYAN : AMBER;
        colors[i * 3 + 0] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aBright", new THREE.BufferAttribute(brights, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    return geo;
}

function Field({
    count,
    pointerRef,
}: {
    count: number;
    pointerRef: React.MutableRefObject<PointerState>;
}) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const geometry = useMemo(() => makeGeometry(count), [count]);
    const { viewport } = useThree();

    useEffect(() => {
        return () => geometry.dispose();
    }, [geometry]);

    useFrame((state, delta) => {
        const mat = materialRef.current;
        if (!mat) return;
        mat.uniforms.uTime.value += delta;
        mat.uniforms.uBoundsX.value = viewport.width / 2 + 0.4;
        mat.uniforms.uBoundsY.value = viewport.height / 2 + 0.4;
        mat.uniforms.uPixelRatio.value = viewport.dpr;

        const p = pointerRef.current;
        mat.uniforms.uPointer.value.set(
            p.x * (viewport.width / 2),
            p.y * (viewport.height / 2)
        );
        mat.uniforms.uPointerActive.value = THREE.MathUtils.lerp(
            mat.uniforms.uPointerActive.value,
            p.active,
            0.15
        );
    });

    return (
        <points geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={VERTEX_SHADER}
                fragmentShader={FRAGMENT_SHADER}
                transparent
                depthWrite={false}
                depthTest={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime: { value: 0 },
                    uBoundsX: { value: 2 },
                    uBoundsY: { value: 2 },
                    uPointer: { value: new THREE.Vector2(9999, 9999) },
                    uPointerActive: { value: 0 },
                    uPointerRadius: { value: POINTER_FIELD_RADIUS },
                    uPixelRatio: { value: 1 },
                    uMaxAlpha: { value: MAX_PARTICLE_ALPHA },
                }}
            />
        </points>
    );
}

function supportsWebGL(): boolean {
    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl2") || canvas.getContext("webgl"))
        );
    } catch {
        return false;
    }
}

// Older/exotic devices can throw during context creation deep inside
// three.js/r3f — this keeps a failure from taking down the page.
class CanvasErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: unknown) {
        console.warn("DriftField: WebGL canvas failed to initialize", error);
    }

    render() {
        return this.state.hasError ? null : this.props.children;
    }
}

export default function DriftField({
    className = "",
    density = 1,
}: {
    className?: string;
    density?: number;
}) {
    const reduced = useReducedMotion();
    const wrapRef = useRef<HTMLDivElement>(null);
    const pointerRef = useRef<PointerState>({ x: 9999, y: 9999, active: 0 });
    const [nearViewport, setNearViewport] = useState(false);
    const [count, setCount] = useState(DESKTOP_PARTICLE_COUNT);
    const [webglOk, setWebglOk] = useState(true);

    useEffect(() => {
        setWebglOk(supportsWebGL());
    }, []);

    useEffect(() => {
        function updateCount() {
            const base =
                window.innerWidth < MOBILE_BREAKPOINT_PX
                    ? MOBILE_PARTICLE_COUNT
                    : DESKTOP_PARTICLE_COUNT;
            setCount(Math.max(50, Math.round(base * density)));
        }
        updateCount();
        window.addEventListener("resize", updateCount);
        return () => window.removeEventListener("resize", updateCount);
    }, [density]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => setNearViewport(entries[0]?.isIntersecting ?? false),
            { rootMargin: NEAR_VIEWPORT_ROOT_MARGIN }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (reduced) return;
        function handleMove(e: MouseEvent) {
            const el = wrapRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;
            if (!inside) {
                pointerRef.current.active = 0;
                return;
            }
            pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointerRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            pointerRef.current.active = 1;
        }
        function handleLeave() {
            pointerRef.current.active = 0;
        }
        // A window-level listener (rather than one on this element) so the
        // field still responds while the cursor is over the foreground
        // content stacked on top of this canvas.
        window.addEventListener("mousemove", handleMove, { passive: true });
        window.addEventListener("mouseleave", handleLeave, { passive: true });
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseleave", handleLeave);
        };
    }, [reduced]);

    if (reduced) {
        // Static sparse dot pattern — no motion, no WebGL.
        return (
            <div
                aria-hidden="true"
                className={`pointer-events-none ${className}`}
                style={{
                    backgroundImage:
                        "radial-gradient(rgba(127,227,255,0.22) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    opacity: 0.4,
                }}
            />
        );
    }

    return (
        <div
            ref={wrapRef}
            className={`pointer-events-none ${className}`}
            aria-hidden="true"
            data-drift-field="true"
        >
            {nearViewport && webglOk && (
                <CanvasErrorBoundary>
                    <Canvas
                        dpr={[1, 1.75]}
                        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <Field count={count} pointerRef={pointerRef} />
                    </Canvas>
                </CanvasErrorBoundary>
            )}
            {/* Readability guardrail — darken behind content so bright
                streaks never fight with foreground text. */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(11,13,16,0.15), rgba(11,13,16,0.4) 60%, rgba(11,13,16,0.55))",
                }}
            />
        </div>
    );
}
