import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get("file");
        const folder = (form.get("folder") as string | null) ?? "/blog";

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 16 MB guard
        if (file.size > 16 * 1024 * 1024) {
            return NextResponse.json({ error: "File exceeds 16 MB limit" }, { status: 413 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await imagekit.upload({
            file: buffer,
            // Strip special chars so ImageKit filename stays clean
            fileName: file.name.replace(/[^a-zA-Z0-9._-]/g, "_"),
            folder,
            useUniqueFileName: true,
        });

        return NextResponse.json({
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            width: result.width,
            height: result.height,
        });
    } catch (err) {
        console.error("[imagekit/upload]", err);
        return NextResponse.json(
            { error: "Upload failed. Check server logs." },
            { status: 500 },
        );
    }
}
