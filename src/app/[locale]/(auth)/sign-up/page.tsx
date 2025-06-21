"use client";

import { Github, Loader, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authClient } from "~/lib/auth/client";
import { Link, useRouter } from "~/lib/i18n/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (error) {
      toast.error(error.message || error.statusText);
    } else {
      toast.success("Account created successfully!");
      router.push("/");
    }
    setIsLoading(false);
  };

  const googleSignIn = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      return toast.warning("Google client ID is not set.");
    }
    authClient.signIn
      .social({
        provider: "google",
      })
      .catch((e) => {
        toast.error(e.error);
      });
  };

  const githubSignIn = () => {
    if (!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) {
      return toast.warning("GitHub client ID is not set.");
    }
    authClient.signIn
      .social({
        provider: "github",
      })
      .catch((e) => {
        toast.error(e.error);
      });
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-background border-none mx-auto shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information below to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Kirk Lin"
                disabled={isLoading}
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="kirk@kirklin.cn"
                disabled={isLoading}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignUp();
                  }
                }}
                className="h-10"
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            <Button
              disabled={isLoading}
              className="w-full h-10 font-medium"
              onClick={handleSignUp}
            >
              {isLoading && <Loader className="size-4 animate-spin mr-2" />}
              Create Account
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={googleSignIn}
              className="h-10"
              disabled={isLoading}
            >
              <LogIn className="size-4 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={githubSignIn}
              className="h-10"
              disabled={isLoading}
            >
              <Github className="size-4 mr-2" />
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?
            {" "}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
