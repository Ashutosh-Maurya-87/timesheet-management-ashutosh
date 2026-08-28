import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;

    const isProtectedRoute =
        req.nextUrl.pathname.startsWith("/dashboard");

    if (
        isProtectedRoute &&
        !isLoggedIn
    ) {
        const unauthorizedUrl = new URL(
            "/unauthorized",
            req.nextUrl.origin
        );

        return Response.redirect(
            unauthorizedUrl
        );
    }
});

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
};