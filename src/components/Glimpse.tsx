import {
    Glimpse as GlimpseRoot,
    GlimpseContent,
    GlimpseDescription,
    GlimpseImage,
    GlimpseTitle,
    GlimpseTrigger,
} from "@/components/kibo-ui/glimpse";
import { glimpse } from "@/components/kibo-ui/glimpse/server";

type GlimpseProps = {
    href: string;
    className?: string;
    children: React.ReactNode;
    openDelay?: number;
    closeDelay?: number;
    contentWidth?: string;
};

const Glimpse = async ({
                           href,
                           className,
                           children,
                           openDelay = 0,
                           closeDelay = 0,
                           contentWidth = "w-80",
                       }: GlimpseProps) => {
    const data = await glimpse(href);

    return (
        <GlimpseRoot closeDelay={closeDelay} openDelay={openDelay}>
            <GlimpseTrigger asChild>
                <a className={className} href={href}>
                    {children}
                </a>
            </GlimpseTrigger>
            <GlimpseContent className={contentWidth}>
                <GlimpseImage src={data.image ?? ""} />
                <GlimpseTitle>{data.title}</GlimpseTitle>
                <GlimpseDescription>{data.description}</GlimpseDescription>
            </GlimpseContent>
        </GlimpseRoot>
    );
};

export default Glimpse;