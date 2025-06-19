"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth/client";
import ProfileForm from "./profile-form";
import SecuritySettings from "./security-settings";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  // Show loading state
  if (isPending) {
    return (
      <>
        <Header />
        <div className="container py-8 space-y-8">
          <div className="max-w-md mx-auto">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Should not happen, but just in case
  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <>
      <Header />
      <div className="container py-12">
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
          {/* Profile header */}
          <Card className="border shadow-md">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="text-2xl">{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{user.name || t("anonymousUser")}</h1>
                  <p className="text-muted-foreground">{user.email}</p>

                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {user.emailVerified && (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                        {t("verified")}
                      </div>
                    )}

                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {t("member")}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile content */}
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8 w-full sm:w-auto">
              <TabsTrigger value="general" className="px-8">{t("general")}</TabsTrigger>
              <TabsTrigger value="security" className="px-8">{t("security")}</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle>{t("profileInformation")}</CardTitle>
                  <CardDescription>{t("updateProfileDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle>{t("securitySettings")}</CardTitle>
                  <CardDescription>{t("securityDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await authClient.signOut();
                      router.push("/");
                    }}
                  >
                    {t("signOut")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
