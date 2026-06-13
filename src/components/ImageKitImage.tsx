import NextImage from "next/image";
import type { ImageProps } from "next/image";

interface ImageKitImageProps extends Omit<ImageProps, "src"> {
    /**
     * Either a full ImageKit URL or just the path after your URL endpoint.
     * e.g. "/blog/my-image.jpg" or "https://ik.imagekit.io/xxx/blog/my-image.jpg"
     */
    src: string;
    /**
     * ImageKit transformation string, e.g. "tr=w-800,q-80"
     * Appended as a query param so the CDN applies it on the fly.
     */
    transform?: string;
}

const IK_BASE = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";

function resolveUrl(src: string, transform?: string): string {
    // Already a full URL — use as-is (or append transform)
    const base = src.startsWith("http") ? src : `${IK_BASE}${src}`;
    if (!transform) return base;
    return base.includes("?") ? `${base}&${transform}` : `${base}?${transform}`;
}

/**
 * Drop-in replacement for <Image> that knows about ImageKit transforms.
 * All standard Next.js Image props are forwarded unchanged.
 *
 * Usage:
 *   <ImageKitImage src="/blog/photo.jpg" width={800} height={450} alt="…" />
 *   <ImageKitImage src="/blog/photo.jpg" transform="tr=w-400,q-75" fill alt="…" />
 */
export function ImageKitImage({ src, transform, alt, ...rest }: ImageKitImageProps) {
    return <NextImage src={resolveUrl(src, transform)} alt={alt} {...rest} />;
}
