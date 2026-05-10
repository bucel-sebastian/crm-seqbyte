"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { login } from "@/server/actions/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [errorMessage, formAction, isPending] = useActionState<
    string | undefined,
    FormData
      >(login, undefined);
  
   const showToast = (message: string, type: "error" | "success") => {
    if (type === "error") {
      toast.error(message, { position: "top-center" });
    } else {
      toast.success(message, { position: "top-center" });
    }
  };

  useEffect(() => {
    if (errorMessage) {
      showToast(errorMessage, "error");
    }
  }, [errorMessage]);


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" type="password" name="password" required />
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Se incarcă" : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
       &copy; Seqbyte Solutions. All rights reserved.
      </FieldDescription>
    </div>
  )
}
