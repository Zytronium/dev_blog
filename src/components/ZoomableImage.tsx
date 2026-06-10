"use client";

import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import Image from "next/image";

interface ZoomableImageProps {
    src: string;
    alt: string;
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
    height: number;
    width: number;
    rounded?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
}

const sizeMap = {
    xs: "w-80",
    sm: "w-96",
    md: "w-128",
    lg: "w-160",
    xl: "w-192",
    "2xl": "w-224",
    "3xl": "w-256",
    "4xl": "w-288",
    "5xl": "w-320",
    "6xl": "w-384",
    full: "w-full"
};

/* for the correct rounded classes to work, we must have those classes in full somewhere in text in a file like this.
* Just programatically completing the class does not work. With that said...
* rounded-xs rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl rounded-4xl rounded-full */

export default function ZoomableImage({src, alt, size, height, width, rounded}: ZoomableImageProps) {
    return (
        <ImageZoom>
            <Image
                alt={alt}
                className={`h-auto ${sizeMap[size]} ${rounded ? `rounded-${rounded}` : ""}`}
                height={height}
                src={src}
                unoptimized
                width={width}
            />
        </ImageZoom>
    );
} 
