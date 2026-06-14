"use client";

import { useEffect, useState } from "react";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";

function useGlitchText(target: string, delay: number = 0) {
    const [display, setDisplay] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        let frame: ReturnType<typeof setTimeout>;
        let iteration = 0;

        const start = () => {
            const interval = setInterval(() => {
                setDisplay(
                    target
                        .split("")
                        .map((char, i) => {
                            if (char === " ") return " ";
                            if (i < iteration) return target[i];
                            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                        })
                        .join("")
                );
                if (iteration >= target.length) {
                    clearInterval(interval);
                    setDisplay(target);
                    setDone(true);
                }
                iteration += 0.4;
            }, 40);
        };

        frame = setTimeout(start, delay);
        return () => clearTimeout(frame);
    }, [target, delay]);

    return { display, done };
}

function ScanlineOverlay() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-10"
            style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            }}
        />
    );
}

function GridBg() {
    return (
        <div
            className="pointer-events-none fixed inset-0"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(0,178,255,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,178,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
            }}
        />
    );
}

function CornerAccent({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
    const styles: Record<string, React.CSSProperties> = {
        tl: {top: 88, left: 24, borderTop: "2px solid", borderLeft: "2px solid"},
        tr: {top: 88, right: 24, borderTop: "2px solid", borderRight: "2px solid"},
        bl: { bottom: 24, left: 24, borderBottom: "2px solid", borderLeft: "2px solid" },
        br: { bottom: 24, right: 24, borderBottom: "2px solid", borderRight: "2px solid" },
    };
    return (
        <div
            className="fixed w-8 h-8 pointer-events-none z-20"
            style={{
                ...styles[position],
                borderColor: "var(--primary)",
                opacity: 0.6,
            }}
        />
    );
}

function TypewriterLine({ text, delay, color = "var(--primary)", className = "" }: {
    text: string;
    delay: number;
    color?: string;
    className?: string;
}) {
    const [visible, setVisible] = useState(false);
    const [chars, setChars] = useState("");

    useEffect(() => {
        const t = setTimeout(() => {
            setVisible(true);
            let i = 0;
            const iv = setInterval(() => {
                setChars(text.slice(0, i));
                i++;
                if (i > text.length) clearInterval(iv);
            }, 28);
            return () => clearInterval(iv);
        }, delay);
        return () => clearTimeout(t);
    }, [text, delay]);

    if (!visible) return null;
    return (
        <p
            className={`font-mono text-xs tracking-widest ${className}`}
            style={{ color, fontFamily: "'Victor Mono', monospace" }}
        >
            {chars}
            {chars.length < text.length && (
                <span className="animate-pulse">█</span>
            )}
        </p>
    );
}

export default function CongratulationsYouFoundMePage() {
    const headline = useGlitchText("ACCESS GRANTED", 1800);
    const sub = useGlitchText("CLASSIFIED NODE UNLOCKED", 2600);
    const [showBadge, setShowBadge] = useState(false);
    const [showLines, setShowLines] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setShowBadge(true), 1000);
        const t2 = setTimeout(() => setShowLines(true), 3600);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div
            className="relative h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden select-none"
            style={{ background: "radial-gradient(ellipse at 50% 40%, #0d0630 0%, #050214 60%, #000 100%)" }}
        >
            <ScanlineOverlay />
            <GridBg />
            <CornerAccent position="tl" />
            <CornerAccent position="tr" />
            <CornerAccent position="bl" />
            <CornerAccent position="br" />

            {/* Ambient glows */}
            <div className="pointer-events-none fixed top-1/3 left-1/4 w-[500px] h-[500px] rounded-full"
                 style={{ background: "radial-gradient(circle, rgba(200,0,255,0.07) 0%, transparent 70%)" }} />
            <div className="pointer-events-none fixed bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
                 style={{ background: "radial-gradient(circle, rgba(0,244,255,0.06) 0%, transparent 70%)" }} />

            <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-2xl">

                {/* Breach badge */}
                {showBadge && (
                    <div
                        className="flex items-center gap-2 px-4 py-1.5"
                        style={{
                            border: "1px solid rgba(0,244,255,0.4)",
                            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                            background: "rgba(0,244,255,0.06)",
                            animation: "fadeIn 0.4s ease forwards",
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00f4ff", boxShadow: "0 0 6px #00f4ff" }} />
                        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#00f4ff", fontFamily: "'Victor Mono', monospace" }}>
                            ZYTRONIUM SECURE NETWORK
                        </span>
                    </div>
                )}

                {/* Main headline */}
                <div className="space-y-2">
                    <h1
                        className="text-5xl sm:text-7xl font-bold tracking-[0.12em] leading-none"
                        style={{
                            fontFamily: "Aquire, sans-serif",
                            background: "linear-gradient(90deg, #00f4ff 0%, #c800ff 50%, #ff0454 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            filter: headline.done ? "drop-shadow(0 0 24px rgba(200,0,255,0.5))" : "none",
                            transition: "filter 0.6s ease",
                            minHeight: "1.1em",
                        }}
                    >
                        {headline.display || "\u00A0"}
                    </h1>

                    <p
                        className="text-sm sm:text-base tracking-[0.25em] uppercase"
                        style={{
                            fontFamily: "'Victor Mono', monospace",
                            color: sub.done ? "rgba(200,0,255,0.9)" : "rgba(200,0,255,0.6)",
                            transition: "color 0.4s ease",
                            minHeight: "1.4em",
                        }}
                    >
                        {sub.display || "\u00A0"}
                    </p>
                </div>

                {/* Divider */}
                {showLines && (
                    <div className="flex items-center gap-3 w-full max-w-xs">
                        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(0,178,255,0.5))" }} />
                        <div className="w-1 h-1 rounded-full" style={{ background: "var(--primary)", boxShadow: "0 0 6px var(--primary)" }} />
                        <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(0,178,255,0.5))" }} />
                    </div>
                )}

                {/* Terminal log lines */}
                {showLines && (
                    <div
                        className="w-full max-w-md text-left space-y-1.5 px-5 py-4"
                        style={{
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(0,178,255,0.15)",
                            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        }}
                    >
                        <TypewriterLine text="> Breach vector: right-click context menu" delay={0} color="rgba(0,244,255,0.5)" />
                        <TypewriterLine text="> Identity: curious human" delay={500} color="rgba(0,244,255,0.5)" />
                        <TypewriterLine text="> Threat level: zero" delay={1000} color="rgba(0,244,255,0.5)" />
                        <TypewriterLine text="> Clearance: NONE" delay={1500} color="rgba(200,0,255,0.8)" />
                        <TypewriterLine text="> Welcome to the hidden layer." delay={2100} color="rgba(255,255,255,0.7)" />
                        <TypewriterLine text="> There's absolutely nothing to do here." delay={3500} color="rgba(200,200,200,0.6)" />
                    </div>
                )}

                {/* Flavor copy */}
                {showLines && (
                    <p
                        className="text-xs tracking-wider max-w-sm leading-relaxed"
                        style={{
                            color: "rgba(255,255,255,0.3)",
                            fontFamily: "'Victor Mono', monospace",
                        }}
                    >
                        Not all who wander are lost
                    </p>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
