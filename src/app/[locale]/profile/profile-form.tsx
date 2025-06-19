"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface ProfileFormProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations("Profile");
  const [isLoading, setIsLoading] = useState(false);

  // Define form schema with Zod
  const formSchema = z.object({
    name: z.string().min(2, t("nameValidation")),
    imageUrl: z.string().url(t("imageUrlValidation")).optional().or(z.literal("")),
  });

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      imageUrl: user.image || "",
    },
  });

  // Form submission handler
  async function onSubmit(_values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Here we would normally update the user profile
      // For now, just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(t("profileUpdated"));
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(t("profileUpdateError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("displayName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("yourName")} className="h-10" {...field} />
              </FormControl>
              <FormDescription>{t("displayNameDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profileImage")}</FormLabel>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-muted">
                  <AvatarImage src={field.value || undefined} alt={user.name || "User"} />
                  <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <FormControl className="w-full">
                  <Input placeholder={t("imageUrlPlaceholder")} className="h-10" {...field} />
                </FormControl>
              </div>
              <FormDescription>{t("imageUrlDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-10 font-medium">
            {isLoading && <Loader className="size-4 animate-spin mr-2" />}
            {isLoading ? t("saving") : t("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
