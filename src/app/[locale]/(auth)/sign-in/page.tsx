"use client";

import { Loader, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { GithubIcon } from "~/components/icons/github";
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
import { Link } from "~/lib/i18n/navigation";

export default function SignInPage() {
  const t = useTranslations("Auth");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailAndPasswordSignIn = async () => {
    if (!email || !password) {
      toast.warning(t("missingCredentials"));
      return;
    }

    setLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });
    if (error) {
      toast.error(error.message || t("signInError"));
    }
    setLoading(false);
  };

  // Providers are configured server-side (GITHUB_CLIENT_ID / GOOGLE_CLIENT_ID);
  // an unconfigured provider comes back as an error from the API.
  const socialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
    if (error) {
      toast.error(error.message || t("providerNotConfigured"));
    }
    setSocialLoading(null);
  };

  const busy = loading || socialLoading !== null;

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-background border-none mx-auto shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("signInTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("signInDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              emailAndPasswordSignIn();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                disabled={busy}
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="user@example.com"
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                disabled={busy}
                value={password}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className="h-10"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-10 font-medium"
              disabled={busy}
            >
              {loading
                ? (
                    <Loader className="size-4 animate-spin mr-2" />
                  )
                : null}
              {t("signIn")}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => socialSignIn("google")}
              className="h-10"
              disabled={busy}
            >
              {socialLoading === "google"
                ? <Loader className="size-4 animate-spin mr-2" />
                : <LogIn className="size-4 mr-2" />}
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => socialSignIn("github")}
              className="h-10"
              disabled={busy}
            >
              {socialLoading === "github"
                ? <Loader className="size-4 animate-spin mr-2" />
                : <GithubIcon className="size-4 mr-2" />}
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("noAccount")}
            {" "}
            <Link href="/sign-up" className="text-primary hover:underline font-medium">
              {t("signUp")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
