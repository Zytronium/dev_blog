"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleCloseContextMenu = () => setContextMenu(null);

    useEffect(() => {
        if (contextMenu) {
            document.addEventListener("click", handleCloseContextMenu);
            return () => document.removeEventListener("click", handleCloseContextMenu);
        }
    }, [contextMenu]);

    const navLink = (href: string, label: string) => {
        const active = pathname === href;
        return (
            <Link
                href={href}
                className="relative group text-xs tracking-widest uppercase transition-colors duration-200"
                style={{
                    fontFamily: "'Victor Mono', monospace",
                    color: active ? 'var(--primary-bright)' : 'var(--primary)',
                }}
            >
                {label}
                {/* Active underline */}
                <span
                    className="absolute -bottom-1 left-0 h-px transition-all duration-200"
                    style={{
                        width: active ? '100%' : '0%',
                        background: 'var(--primary)',
                        boxShadow: active ? '0 0 6px var(--primary)' : 'none',
                    }}
                />
                {/* Hover underline (only when not active) */}
                {!active && (
                    <span
                        className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-200"
                        style={{ background: 'var(--primary)', opacity: 0.5 }}
                    />
                )}
            </Link>
        );
    };

    return (
        <>
            <nav
                className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-3 backdrop-blur-md"
                style={{
                    background: 'rgba(13, 9, 37, 0.90)',
                    borderBottom: '1px solid rgba(0, 178, 255, 0.2)',
                    boxShadow: '0 4px 32px rgba(0, 178, 255, 0.05)',
                }}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    {/* Desktop: logo image + YTRONIUM wordmark */}
                    <div className="hidden md:flex items-center gap-0">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={44}
                            height={44}
                            priority
                            onContextMenu={handleContextMenu}
                        />
                        {/* SVG wordmark — neon gradient outline, same technique as LogoLarge */}
                        <svg
                            viewBox="0 0 480 62"
                            className="h-[50px] w-auto select-none"
                            aria-hidden="true"
                            style={{ marginLeft: '-2px' }}
                        >
                            <defs>
                                <linearGradient id="nav-neon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f4ff" />
                                    <stop offset="50%" stopColor="#c800ff" />
                                    <stop offset="100%" stopColor="#ff0454" />
                                </linearGradient>
                                <mask id="nav-outline-mask" maskUnits="userSpaceOnUse">
                                    <rect width="480" height="62" fill="black" />
                                    <text
                                        x="4"
                                        y="52"
                                        textAnchor="start"
                                        fontFamily="Aquire, sans-serif"
                                        fontSize="52"
                                        fontWeight="400"
                                        letterSpacing="0.05em"
                                        fill="white"
                                        stroke="white"
                                        strokeWidth="4"
                                        paintOrder="stroke"
                                    >
                                        YTRONIUM
                                    </text>
                                </mask>
                            </defs>
                            {/* Neon gradient visible only through the stroked text outline */}
                            <rect width="480" height="62" fill="url(#nav-neon-gradient)" mask="url(#nav-outline-mask)" />
                            {/* Dark fill on top — same as LogoLarge's fill="black" — so outline glows against dark interior */}
                            <text
                                x="4"
                                y="52"
                                textAnchor="start"
                                fontFamily="Aquire, sans-serif"
                                fontSize="52"
                                fontWeight="400"
                                letterSpacing="0.05em"
                                fill="#0d0925"
                            >
                                YTRONIUM
                            </text>
                        </svg>
                    </div>

                    {/* Mobile: logo only */}
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="block md:hidden"
                        priority
                        onContextMenu={handleContextMenu}
                    />
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-6">
                    {navLink("/", "Home")}
                    <span style={{ color: 'var(--primary)', opacity: 0.25 }}>|</span>
                    {navLink("/browse", "Browse")}
                </div>
            </nav>

            {/* Context menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 py-1 min-w-44"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        background: 'rgba(13, 9, 37, 0.97)',
                        border: '1px solid var(--primary)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 0 20px rgba(0,178,255,0.15)',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    }}
                >
                    <ContextMenuItem href="/congratulations-you-found-me" onClick={handleCloseContextMenu}>
                        Go to super secret place
                    </ContextMenuItem>
                    <ContextMenuItem href="/admin" onClick={handleCloseContextMenu}>
                        Go to admin panel
                    </ContextMenuItem>
                </div>
            )}
        </>
    );
};

function ContextMenuItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase transition-colors duration-150"
            style={{
                fontFamily: "'Victor Mono', monospace",
                color: 'var(--primary)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,178,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
            <span style={{ color: 'var(--secondary-bright)', opacity: 0.7 }}>›</span>
            {children}
        </Link>
    );
}

export default NavBar;
