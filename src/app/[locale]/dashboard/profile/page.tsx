"use client";

import { useState } from "react";
import { DashboardShell } from "~/components/dashboard/dashboard-shell";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { authClient } from "~/lib/auth/client";

// Mock user authentication - in a real app, would use better-auth
export default function ProfilePage() {
  const { data: session } = authClient.useSession();

  const [formState, setFormState] = useState({
    name: session?.user?.name || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    marketingEmails: false,
  });

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call Better Auth's updateUser API
      await authClient.updateUser({
        name: formState.name,
      });

      // Refresh the session data
      window.location.reload();

      // If you had a proper toast system:
      // toast({
      //   title: "Profile updated",
      //   description: "Your profile has been successfully updated.",
      // });
    } catch (error) {
      console.error("Failed to update profile", error);
      // If you had a proper toast system:
      // toast({
      //   title: "Update failed",
      //   description: "Could not update your profile. Please try again later.",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setIsSubmitting(true);

    // Simple validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      // Call Better Auth's changePassword API
      await authClient.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        revokeOtherSessions: true, // Revoke other sessions
      });

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // If you had a proper toast system:
      // toast({
      //   title: "Password updated",
      //   description: "Your password has been successfully updated.",
      // });
    } catch (error: any) {
      console.error("Failed to update password", error);
      setPasswordError(error.message || "Could not update password. Please check your current password.");
      // If you had a proper toast system:
      // toast({
      //   title: "Update failed",
      //   description: "Could not update password. Please check your current password.",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-medium">Profile</h2>

        {/* User profile header */}
        <div className="flex flex-col rounded-lg border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              {session?.user?.image && (
                <AvatarImage src={session.user.image} alt={session.user.name || "User avatar"} />
              )}
              <AvatarFallback className="text-lg">
                {session?.user?.name ? session.user.name.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{session?.user?.name || "Loading..."}</h3>
              <p className="text-sm text-muted-foreground">{session?.user?.email || ""}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">General Information</h3>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email changes need to be handled through admin.
                  </p>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-6">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-6">Security Settings</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="2fa">Two-factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      id="2fa"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={checked =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about account activity
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={securitySettings.emailNotifications}
                      onCheckedChange={checked =>
                        setSecuritySettings({ ...securitySettings, emailNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="marketing">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new products and features
                      </p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={securitySettings.marketingEmails}
                      onCheckedChange={checked =>
                        setSecuritySettings({ ...securitySettings, marketingEmails: checked })}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
