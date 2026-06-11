import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
    return (
        <nav
            className="flex items-center justify-between gap-4 p-4 border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <Link href="/" className="flex items-center">
                <div className="hidden md:flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="hover:opacity-80 transition-opacity"
                        priority
                    />
                    <span
                        className="text-[40px] font-bold leading-none bg-gradient-to-r from-[#1BDBFFFF] via-[#711BFFFF] to-[#FF0071FF] bg-clip-text text-transparent -ml-3"
                        style={{fontFamily: 'Aquire, sans-serif'}}
                    >
                        YTRONIUM
                    </span>
                </div>
                <Image
                    src="/logo_small.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="block md:hidden hover:opacity-80 transition-opacity"
                    priority
                />
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/"
                      className="text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300 font-medium">
                    Home
                </Link>
                <span className="text-cyan-600/50">|</span>
                <Link href="/browse"
                      className="text-cyan-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300 font-medium">
                Browse
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
