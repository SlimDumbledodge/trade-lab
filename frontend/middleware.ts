export { default } from "next-auth/middleware"

export const config = {
    matcher: ["/portfolio/:path*", "/profile/:path*", "/market/:path*", "/transactions"],
}
