import Credentials from "@auth/core/providers/credentials";
import { initAuthConfig } from "@hono/auth-js";
import bcryptjs from "bcryptjs";
import { env } from "hono/adapter";
import { z } from "zod";
import { prismaClient } from "../lib/prisma/client";

const parseCredentials = ({
  email,
  password,
}: { email: unknown; password: unknown }) => {
  const credentialsSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const result = credentialsSchema.safeParse({ email, password });
  if (!result.success) {
    throw new Error("Invalid Email or Password");
  }
  return result.data;
};

export const authMiddleware = initAuthConfig((c) => {
  const { AUTH_SECRET } = env<{ AUTH_SECRET: string }>(c);
  return {
    session: {
      strategy: "jwt",
    },
    secret: AUTH_SECRET,
    // MEMO: Credentialsでのログイン処理をPrismaAdapterがサポートしていないのでコメントアウト
    // adapter: CustomPrismaAdapter(prismaClient),
    providers: [
      Credentials({
        credentials: {
          email: { label: "Username" },
          password: { label: "Password", type: "password" },
        },
        async authorize({ email, password }) {
          const credentials = parseCredentials({ email, password });
          const user = await prismaClient.user.findFirst({
            where: { email: credentials.email },
          });

          if (
            !user ||
            !user.hashedPassword ||
            !bcryptjs.compareSync(credentials.password, user.hashedPassword)
          ) {
            throw new Error("Invalid Credentials");
          }

          return {
            ...user,
            hashedPassword: undefined,
          };
        },
      }),
    ],
    pages: {
      signIn: "/auth/sign-in",
      error: "/error",
    },
  };
});
