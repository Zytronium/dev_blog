import Link from 'next/link';

export default function AdminPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
            {/* Scanline + grid background */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                     backgroundImage: `
                        linear-gradient(rgba(0,178,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,178,255,0.03) 1px, transparent 1px)
                    `,
                     backgroundSize: '40px 40px',
                 }}
            />
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(127,9,246,0.12) 0%, transparent 70%)' }}
            />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(0,178,255,0.10) 0%, transparent 70%)' }}
            />

            <div className="max-w-2xl w-full space-y-10 relative z-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <p className="text-xs tracking-[0.4em] uppercase"
                       style={{ color: 'var(--secondary-bright)', fontFamily: "'Victor Mono', monospace" }}>
                        ◈ SECURE ACCESS GRANTED ◈
                    </p>
                    <h1 className="h1" style={{ letterSpacing: '0.05em' }}>
                        Admin Panel
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-1">
                        <div className="h-px flex-1 max-w-24"
                             style={{ background: 'linear-gradient(to right, transparent, var(--secondary))' }} />
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                             style={{ background: 'var(--accent)' }} />
                        <div className="h-px flex-1 max-w-24"
                             style={{ background: 'linear-gradient(to left, transparent, var(--secondary))' }} />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AdminCard
                        href="/admin/new-post"
                        label="Draft New Post"
                        icon="✦"
                        description="Write and publish content"
                        accentVar="--primary"
                        accentLighterVar="--primary-lighter"
                        accentDarkerVar="--primary-darker"
                    />
                    <AdminCard
                        href="/admin/manage-posts"
                        label="Manage Posts"
                        icon="◈"
                        description="Edit, publish, or archive"
                        accentVar="--secondary"
                        accentLighterVar="--secondary-lighter"
                        accentDarkerVar="--secondary-darker"
                    />
                </div>

                {/* Footer status bar */}
                <div className="flex items-center justify-center gap-2 text-xs"
                     style={{ color: 'var(--muted-foreground)', fontFamily: "'Victor Mono', monospace" }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
                    ZYTRONIUM DEV BLOG BACKEND — ADMIN v1
                </div>
            </div>
        </div>
    );
}

interface AdminCardProps {
    href: string;
    label: string;
    description: string;
    icon: string;
    accentVar: string;
    accentLighterVar: string;
    accentDarkerVar: string;
}

function AdminCard({href, label, description, icon, accentVar, accentLighterVar, accentDarkerVar}: AdminCardProps) {
    return (
        <Link
            href={href}
            className="group relative flex flex-col gap-4 px-8 py-10 transition-all duration-300"
            style={{
                background: 'rgba(26, 19, 64, 0.7)',
                border: `1px solid var(${accentVar})`,
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                backdropFilter: 'blur(8px)',
            }}
        >
            {/* Hover glow overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                 style={{
                     background: `linear-gradient(135deg, rgba(var(${accentVar}), 0.08) 0%, transparent 60%)`,
                     clipPath: 'inherit',
                 }}
            />
            {/* Corner accent dots */}
            <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
                 style={{
                     borderTop: `2px solid var(${accentLighterVar})`,
                     borderRight: `2px solid var(${accentLighterVar})`,
                 }}
            />
            <div className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none"
                 style={{
                     borderBottom: `2px solid var(${accentVar})`,
                     borderLeft: `2px solid var(${accentVar})`,
                 }}
            />

            {/* Icon */}
            <div className="text-3xl transition-transform duration-300 group-hover:scale-110"
                 style={{ color: `var(${accentLighterVar})` }}>
                {icon}
            </div>

            {/* Text */}
            <div>
                <div className="font-['Aquire'] text-xl font-bold mb-1 transition-colors duration-200"
                     style={{ color: `var(${accentLighterVar})` }}>
                    {label}
                </div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {description}
                </div>
            </div>

            {/* Arrow */}
            <div className="text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
                 style={{ color: `var(${accentVar})`, fontFamily: "'Victor Mono', monospace" }}>
                ENTER →
            </div>

            {/* Bottom scan line */}
            <div className="absolute bottom-0 left-6 right-6 h-px opacity-40"
                 style={{ background: `linear-gradient(to right, transparent, var(${accentVar}), transparent)` }}
            />
        </Link>
    );
}
