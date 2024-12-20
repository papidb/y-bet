import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
});

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                onClick={() => {
                  setRememberMe(!rememberMe);
                }}
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await signIn
                  .email({ email, password })
                  .finally(() => setLoading(false));
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500"></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
