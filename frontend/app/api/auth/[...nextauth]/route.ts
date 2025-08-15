import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Mot de passe', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    if (!res.ok) {
                        console.error('Login API returned status', res.status);
                        return null;
                    }

                    const data = await res.json();

                    // Vérifier la structure exacte
                    if (data.success && data.data?.accessToken && data.data?.user) {
                        const user = data.data.user;
                        return {
                            id: user.id,
                            name: user.username,
                            email: user.email,
                            role: user.role,
                            subscription: user.subscription,
                            accessToken: data.data.accessToken,
                        };
                    }

                    return null;
                } catch (err) {
                    console.error('Authorize error:', err);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user = token.user;
            return session;
        },
    },

    pages: {
        signIn: '/connexion',
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
