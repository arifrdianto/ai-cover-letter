import NextAuth, { NextAuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email r_basicprofile",
        },
      },
      profile(profile) {
        return {
          id: profile.sub || profile.id,
          name: `${profile.given_name || ""} ${
            profile.family_name || ""
          }`.trim(),
          email: profile.email || "",
          image: profile.picture || "",
        };
      },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
    }),
  ],
  // Configure callbacks to handle session and token
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.id = profile?.sub as string;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("SignIn Event", message);
    },
    async signOut(message) {
      console.log("SignOut Event", message);
    },
  },
  // Configure pages for custom handling
  // pages: {
  //   signIn: "/",
  //   error: "/",
  // },
  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
