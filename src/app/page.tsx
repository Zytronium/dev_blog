import ZoomableImage from "@/components/ZoomableImage";
import Link from "next/link";
import Glimpse from "@/components/Glimpse";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-between px-6 py-12 md:px-16 lg:px-32 xl:px-64">
            <h1 className="h1">Hello World!</h1>
            <p>
                Welcome to my personal dev blog! If you just happened to stumble across this, thanks for checking it
                out! I hope you find my blog interesting. More likely, you&apos;re one of my friends or acquaintances.
                If that&apos;s the case, well, still thanks for checking it out!
            </p>

            <section className="mt-8 w-full">
                <h2 className="h2 text-left">About Me</h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-primary/30 bg-muted/40 p-6 shadow-[0_0_25px_rgba(0,178,255,0.08)] md:col-span-2">
                        <h3 className="h3 mt-0">Who I Am</h3>
                        <p>
                            My name is Zytronium, or at least that&apos;s what I go by online. I&apos;m a passionate
                            developer from Oklahoma who loves to show off my projects I make for fun. I have over 300
                            repositories on GitHub, and I code for fun as my primary hobby.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-secondary/30 bg-secondary/10 p-6 shadow-[0_0_25px_rgba(127,9,246,0.1)]">
                        <h3 className="h3 mt-0">Main Focus</h3>
                        <p className="mb-0 text-secondary-pastel">
                            Full-stack web development, with a focus on modern design, and, sometimes, small games.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-accent/30 bg-accent/10 p-6 shadow-[0_0_25px_rgba(224,4,71,0.1)]">
                        <h3 className="h3 mt-0">What I Build</h3>
                        <p className="mb-0 text-accent-pastel">
                            I build websites, mobile apps, games, Python scripts, and more, though I&apos;m primarily a
                            web developer.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-primary/30 bg-primary/10 p-6 shadow-[0_0_25px_rgba(0,178,255,0.08)] md:col-span-2">
                        <h3 className="h3 mt-0">Favorite Genre</h3>
                        <p>
                            My favorite TV show is Star Trek, and I love anything Sci-Fi. I have a lot of space-themed
                            project ideas, and have to suppress the urge to go for a futuristic theme instead of a
                            modern one when working on client projects.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-secondary/30 bg-muted/40 p-6 shadow-[0_0_25px_rgba(127,9,246,0.1)] md:col-span-2">
                        <h3 className="h3 mt-0">Why This Blog Exists</h3>
                        <p className="mb-0">
                            I love to show off what I&apos;ve been working on, especially when I think it&apos;s cool or
                            fun, so I decided to build this website to do just that. Way too often, I ramble on Discord
                            about stuff that should go in a dev blog instead. Granted, I&apos;ll probably keep doing
                            that since very few people will probably ever see my blog, let alone read all my posts.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-primary/30 bg-background/70 p-6 shadow-[0_0_25px_rgba(0,178,255,0.08)]">
                        <h3 className="h3 mt-0">Other Hobby</h3>
                        <p className="mb-0">
                            I also love aerospace and fly remote-controlled model planes for fun when the weather is nice{" "}
                            <span className="h6">(so yeah, I touch grass)</span>.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-secondary/10 to-primary/10 p-6 shadow-[0_0_30px_rgba(224,4,71,0.12)] md:col-span-3">
                        <h3 className="h3 mt-0">Satire Dev Blog</h3>
                        <p>
                            Speaking of dev blogs, you should check out my{" "}
                            <Link href="https://satire.zytronium.dev/" className="link">
                                satire dev blog
                            </Link>{" "}
                            too! I post something new there roughly once every month or two, and if you have a sense of
                            humor, I think you&apos;ll get a good kick out of some of my posts.
                        </p>
                        <p className="mb-0">
                            For example, one of my favorite posts I wrote is about{" "}
                            <Glimpse
                                href="https://satire.zytronium.dev/post/i-am-going-to-program-a-fighter-jet"
                                className="link"
                            >
                                how I programmed a fighter jet into existence
                            </Glimpse>{" "}
                            because I&apos;m &quot;just that f**king good&quot; at programming. Another one of my
                            favorites is about{" "}
                            <Glimpse
                                href="https://satire.zytronium.dev/post/i-hacked-into-the-fbi-database-you-will-not-believe-whats-on-the-fbi-watchlist"
                                className="link"
                            >
                                hacking into the FBI watchlist
                            </Glimpse>
                            ... except it&apos;s their Netflix watch list.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="my-8 mx-2 md:mx-6 lg:mx-12 w-full border-muted-foreground/50 h-1" />
        </main>
    );
}