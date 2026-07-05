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
import { Link, useRouter } from "~/lib/i18n/navigation";

export default function SignUpPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      toast.warning(t("missingFields"));
      return;
    }

    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (error) {
      toast.error(error.message || t("signUpError"));
    } else {
      // signUp.email auto-signs-in, so land new users in the app like sign-in does.
      toast.success(t("accountCreated"));
      router.push("/dashboard");
    }
    setIsLoading(false);
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

  const busy = isLoading || socialLoading !== null;

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-background border-none mx-auto shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("signUpTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("signUpDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Kirk Lin"
                disabled={busy}
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="kirk@kirklin.cn"
                disabled={busy}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={busy}
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={8}
                className="h-10"
                required
              />
              <p className="text-xs text-muted-foreground">
                {t("passwordHint")}
              </p>
            </div>
            <Button
              disabled={busy}
              type="submit"
              className="w-full h-10 font-medium"
            >
              {isLoading && <Loader className="size-4 animate-spin mr-2" />}
              {t("createAccount")}
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
            {t("hasAccount")}
            {" "}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              {t("signIn")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
