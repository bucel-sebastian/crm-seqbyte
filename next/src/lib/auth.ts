import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.APP_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "user",
    additionalFields: {
      first_name: {
        type: "string",
        required: false,
        input: true,
      },
      last_name: {
        type: "string",
        required: false,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        defaultValue: "user",
        required: true,
        input: false,
      },
      lang: {
        type: "string",
        defaultValue: "en",
        required: false,
        input: false,
      },
    },
  },
  session: {
    modelName: "session",
  },
  account: {
    modelName: "account",
  },
  verification: {
    modelName: "verification",
  },
  advanced: {
    database: {
      generateId: (options) => {
        if (options?.model === "user" || options?.model === "users") {
          return crypto.randomUUID();
        }

        return false;
      },
    },
  },
  plugins: [nextCookies(), admin()],
});
