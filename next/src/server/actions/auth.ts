"use server";

import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieName = "crm-session";
const sessionSecret = process.env.BETTER_AUTH_SECRET ?? "crm-dev-secret";

function encodeSession(payload: { userId: string; email: string; name: string | null }) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", sessionSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function decodeSession(token: string) {
  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", sessionSecret).update(body).digest("base64url");
  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      userId: string;
      email: string;
      name: string | null;
    };
  } catch {
    return null;
  }
}

export async function signInAction(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const passwordAccount = user.accounts.find((account) => account.password);
    if (!passwordAccount?.password) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValidPassword = await bcrypt.compare(password, passwordAccount.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    const token = encodeSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign in failed",
    };
  }
}

export async function getSessionAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookieName)?.value;

    if (!token) {
      return null;
    }

    const session = decodeSession(token);
    if (!session) {
      return null;
    }

    return { user: session };
  } catch {
    return null;
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
  redirect("/login");
}
