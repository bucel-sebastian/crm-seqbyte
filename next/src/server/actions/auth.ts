"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function login(
  __prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  const validation = z
    .object({
      email: z.string().email("email.invalid"),
      password: z.string().min(2, "password.invalid"),
    })
    .safeParse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

  if (!validation.success) {
    return validation.error.issues[0].message;
  }

  const validated = validation.data;

  try {
    const response = await auth.api.signInEmail({
      body: {
        email: validated.email,
        password: validated.password,
      },
    });

    if (response.redirect && response.url) {
      redirect(response.url);
    }

    redirect(`/dashboard/`);
  } catch (error) {
    const digest = (error as { digest?: string })?.digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Login error:", error);
    return "failed";
  }
}

export async function getSessionAction() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
