import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user && "role" in user && user.role) token.role = user.role as string;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      if (session.user && token.role) session.user.role = token.role as string;
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
