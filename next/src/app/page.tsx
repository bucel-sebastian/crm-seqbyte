import { checkSession } from "@/lib/auth-server";

export default async function Index() {
  await checkSession();
}
