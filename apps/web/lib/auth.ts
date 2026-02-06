import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@lumina/db";

const githubId = process.env.GITHUB_ID ?? "";
const githubSecret = process.env.GITHUB_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
  ],
  session: {
    strategy: "database",
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
