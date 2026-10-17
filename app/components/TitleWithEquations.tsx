"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import ParticleTitle from "./ParticleTitle";

// Math equations that play in the background of big titles — semiconductor
// physics / drift-diffusion / THz imaging flavor. Positioning is semi-random
// via a seeded pattern so each section has a distinct backdrop.
type Eq = {
    expr: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    size?: "sm" | "md" | "lg" | "xl";
    opacity?: number;
    rotate?: number;
};

const EQ_PALETTES: Record<string, Eq[]> = {
    about: [
        { expr: "∂n/∂t = D∇²n + μE·∇n − n/τ + G", top: "6%", left: "4%", size: "lg", opacity: 0.08 },
        { expr: "J = q(μnE − D∇n)", top: "30%", left: "52%", size: "md", opacity: 0.07 },
        { expr: "n·p = n_i² exp((E_f − E_i)/kT)", bottom: "18%", left: "8%", size: "md", opacity: 0.06 },
        { expr: "D/μ = kT/q", top: "12%", right: "10%", size: "sm", opacity: 0.08 },
        { expr: "L_D = √(Dτ)", bottom: "8%", right: "12%", size: "sm", opacity: 0.07 },
        { expr: "∇·E = ρ/ε₀", top: "72%", right: "40%", size: "sm", opacity: 0.06 },
    ],
    skills: [
        { expr: "∂n/∂t = D∇²n − n/τ", top: "5%", left: "3%", size: "lg", opacity: 0.08 },
        { expr: "v_drift = μE", top: "18%", right: "8%", size: "md", opacity: 0.07 },
        { expr: "σ = qnμ", bottom: "20%", left: "6%", size: "md", opacity: 0.07 },
        { expr: "τ⁻¹ = σ v_th N_t", top: "60%", left: "48%", size: "sm", opacity: 0.06 },
        { expr: "f(E) = 1 / (exp((E−E_f)/kT) + 1)", bottom: "8%", left: "30%", size: "sm", opacity: 0.07 },
        { expr: "E_g = E_c − E_v", top: "28%", left: "32%", size: "sm", opacity: 0.06 },
        { expr: "E(THz) ∝ ∂J/∂t", bottom: "12%", right: "10%", size: "md", opacity: 0.07 },
    ],
    experiences: [
        { expr: "∂n/∂t = D∇²n + μE·∇n − n/τ + G", top: "4%", left: "4%", size: "xl", opacity: 0.07 },
        { expr: "E(THz, t) ∝ ∂J(t)/∂t", top: "20%", right: "6%", size: "md", opacity: 0.07 },
        { expr: "n_i² = N_c N_v exp(−E_g/kT)", bottom: "18%", left: "8%", size: "md", opacity: 0.06 },
        { expr: "D = μ kT/q", top: "40%", right: "48%", size: "sm", opacity: 0.06 },
        { expr: "∮ E · dA = Q/ε₀", bottom: "8%", right: "14%", size: "md", opacity: 0.06 },
    ],
    research: [
        { expr: "∂n/∂t = D∇²n + μE·∇n − n/τ + G", top: "8%", left: "4%", size: "xl", opacity: 0.09 },
        { expr: "J = qμnE − qD∇n", top: "32%", left: "55%", size: "md", opacity: 0.08 },
        { expr: "E_THz ∝ ∂J/∂t", bottom: "12%", left: "6%", size: "lg", opacity: 0.08 },
        { expr: "∇·E = ρ/ε₀", top: "14%", right: "8%", size: "md", opacity: 0.07 },
        { expr: "⟨v⟩ = μE (Monte Carlo)", bottom: "22%", right: "20%", size: "sm", opacity: 0.07 },
        { expr: "1/τ = σ v_th N_t", top: "62%", left: "34%", size: "sm", opacity: 0.06 },
    ],
    intern: [
        { expr: "Throughput = ops / s", top: "10%", left: "6%", size: "md", opacity: 0.06 },
        { expr: "latency = f(p95, p99)", top: "26%", right: "8%", size: "md", opacity: 0.07 },
        { expr: "Quality = 1 − defects/total", bottom: "14%", left: "10%", size: "md", opacity: 0.07 },
        { expr: "L(θ) = Σ ℓ(ŷ, y)", bottom: "22%", right: "12%", size: "md", opacity: 0.07 },
        { expr: "∂L/∂θ → argmin", top: "56%", left: "44%", size: "sm", opacity: 0.06 },
    ],
    personal: [
        { expr: "UX = f(speed, privacy, cost)", top: "8%", left: "5%", size: "md", opacity: 0.08 },
        { expr: "p(useful | user) → ship", top: "24%", right: "6%", size: "md", opacity: 0.07 },
        { expr: "cost / request ≈ 0", bottom: "18%", left: "8%", size: "md", opacity: 0.07 },
        { expr: "t_deploy → 3 months", bottom: "8%", right: "14%", size: "sm", opacity: 0.07 },
    ],
};

const sizeMap: Record<NonNullable<Eq["size"]>, string> = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-xl",
    lg: "text-xl md:text-3xl",
    xl: "text-3xl md:text-5xl",
};

export function EquationBackdrop({
    palette,
    className = "",
}: {
    palette: keyof typeof EQ_PALETTES;
    className?: string;
}) {
    const eqs = EQ_PALETTES[palette];
    return (
        <div
            aria-hidden="true"
            className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
        >
            {eqs.map((eq, i) => (
                <span
                    key={i}
                    className={`absolute font-serif italic text-zinc-400 whitespace-nowrap ${sizeMap[eq.size ?? "md"]}`}
                    style={{
                        top: eq.top,
                        bottom: eq.bottom,
                        left: eq.left,
                        right: eq.right,
                        opacity: eq.opacity ?? 0.07,
                        transform: eq.rotate ? `rotate(${eq.rotate}deg)` : undefined,
                    }}
                >
                    {eq.expr}
                </span>
            ))}
        </div>
    );
}

export default function TitleWithEquations({
    palette,
    children,
    subtitle,
    chapter,
}: {
    palette: keyof typeof EQ_PALETTES;
    /** The section heading text (string) */
    children: string;
    subtitle?: ReactNode;
    chapter?: string;
}) {
    return (
        <div className="relative px-4 sm:px-6">
            <div className="max-w-[1440px] mx-auto relative py-8 sm:py-10">
                <EquationBackdrop palette={palette} />
                {/* Solid backdrop behind the label/title/caption — matches the
                    section background so it silently occludes any equation
                    glyphs that would otherwise sit behind the text instead of
                    around it (confirmed collision at 390/768/1440px). */}
                <div className="relative bg-slate-ink">
                    {chapter && (
                        <div className="mb-3 flex items-baseline gap-3">
                            <span className="font-mono text-[10px] text-thz-cyan tracking-[0.3em] uppercase">
                                {chapter}
                            </span>
                            <span className="h-px flex-1 bg-slate-line" />
                        </div>
                    )}
                    <ParticleTitle
                        text={children}
                        fontSize={84}
                        fontWeight={700}
                        trigger="view"
                        as="h2"
                    />
                    {subtitle && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-2"
                        >
                            {subtitle}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
