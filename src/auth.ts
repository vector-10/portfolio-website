import NextAuth, { type DefaultSession, type Session } from "next-auth";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: { login?: string } & DefaultSession["user"];
  }
}

const allowedUser = process.env.DASHBOARD_ALLOWED_USER?.toLowerCase();

export const devBypass = process.env.NODE_ENV === "development" && !process.env.AUTH_SECRET;

export function isOwner(session: Session | null) {
  if (devBypass) return true;
  return !!allowedUser && session?.user?.login?.toLowerCase() === allowedUser;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    signIn({ profile }) {
      return !!allowedUser && String(profile?.login ?? "").toLowerCase() === allowedUser;
    },
    jwt({ token, profile, trigger }) {
      if (trigger === "signIn" && profile?.login) token.login = String(profile.login);
      return token;
    },
    session({ session, token }) {
      session.user.login = typeof token.login === "string" ? token.login : undefined;
      return session;
    },
  },
});
