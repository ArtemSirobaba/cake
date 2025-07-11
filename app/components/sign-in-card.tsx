import { Link } from "@remix-run/react";
import { Key, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { signIn } from "~/lib/auth-client";
import { Button } from "~/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/card";
import { Checkbox } from "~/ui/checkbox";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import { PasswordInput } from "~/ui/password-input";

export default function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  return (
    <Card className="z-50 rounded-md rounded-t-none max-w-md">
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
              placeholder="m~example.com"
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
              <Link
                to="/forget-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
              placeholder="Password"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              name="remember-me"
              aria-label="Remember me"
              checked={rememberMe}
              onCheckedChange={(checked) => {
                setRememberMe(checked as boolean);
              }}
            />
            <Label htmlFor="remember-me">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await signIn.email(
                {
                  email: email,
                  password: password,
                  callbackURL: "/dashboard",
                  rememberMe,
                },
                {
                  onRequest: () => {
                    setLoading(true);
                  },
                  onResponse: () => {
                    setLoading(false);
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                }
              );
            }}
          >
            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
                data-testid="loading-spinner"
              />
            ) : (
              "Login"
            )}
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              // await signIn.passkey({
              // 	callbackURL: "/dashboard",
              // });
            }}
          >
            <Key size={16} />
            Sign-in with Passkey
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
