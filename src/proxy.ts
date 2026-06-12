import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = "admin";

function unauthorized() {
    return new NextResponse("Authentication required", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"',
        },
    });
}

function getBasicAuthCredentials(request: NextRequest) {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Basic ")) {
        return null;
    }

    try {
        const encodedCredentials = authorization.slice("Basic ".length);
        const decodedCredentials = atob(encodedCredentials);
        const separatorIndex = decodedCredentials.indexOf(":");

        if (separatorIndex === -1) {
            return null;
        }

        return {
            username: decodedCredentials.slice(0, separatorIndex),
            password: decodedCredentials.slice(separatorIndex + 1),
        };
    } catch {
        return null;
    }
}

export function proxy(request: NextRequest) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.error("ADMIN_PASSWORD is not set");
        return new NextResponse("Admin authentication is not configured", {
            status: 500,
        });
    }

    const credentials = getBasicAuthCredentials(request);

    if (
        !credentials ||
        credentials.username !== ADMIN_USERNAME ||
        credentials.password !== adminPassword
    ) {
        return unauthorized();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
