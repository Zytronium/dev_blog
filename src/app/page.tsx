import ZoomableImage from "@/components/ZoomableImage";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between py-12 px-64">
      <h1 className="text-8xl text-primary font-['Aquire']">Zytronium Dev Blog</h1>
      <p>Hello World!</p>
      <p>Below is the image on my desk matt (except I have the USS Enterprise version, not USS Saturn. I couldn&apos;t find the USS Enterprise one online). What do you think? Pretty cool, huh? I&apos;m a big Star Trek fan.</p>
      <ZoomableImage src={"/images/LCARS.png"} alt={"U.S.S. Saturn LCARS Display"} size={"3xl"} width={2000} height={834} rounded={"4xl"} />
      <p className="mt-4">Too small? Click it to zoom in!</p>
    </main>
  );
}
