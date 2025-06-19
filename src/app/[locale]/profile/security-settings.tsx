"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export default function SecuritySettings() {
  const t = useTranslations("Profile");
  const [isLoading, setIsLoading] = useState(false);

  // Define form schema with Zod
  const formSchema = z.object({
    currentPassword: z.string().min(1, t("currentPasswordRequired")),
    newPassword: z.string().min(8, t("newPasswordValidation")),
    confirmPassword: z.string().min(8, t("confirmPasswordValidation")),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: t("passwordsMustMatch"),
    path: ["confirmPassword"],
  });

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  async function onSubmit(_values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Here we would normally update the password
      // For now, just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success(t("passwordChanged"));
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error(t("passwordChangeError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("currentPassword")}</FormLabel>
              <FormControl>
                <Input type="password" className="h-10" {...field} />
              </FormControl>
              <FormDescription>{t("currentPasswordDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel>{t("newPassword")}</FormLabel>
                <FormControl>
                  <Input type="password" className="h-10" {...field} />
                </FormControl>
                <FormDescription className="text-xs">{t("newPasswordDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input type="password" className="h-10" {...field} />
                </FormControl>
                <div className="min-h-5"> {/* 占位，确保高度一致 */}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-10 font-medium">
            {isLoading && <Loader className="size-4 animate-spin mr-2" />}
            {isLoading ? t("updating") : t("updatePassword")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
