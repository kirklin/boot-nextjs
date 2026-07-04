"use client";

import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, ChevronLeft, Download, Receipt, XCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Link } from "~/lib/i18n/navigation";
import { formatStripeAmount } from "~/lib/stripe/format";

interface PaymentResult {
  status: string | null;
  paymentStatus: string | null;
  mode: string;
  amountTotal: number | null;
  currency: string | null;
  createdAt: string;
  customerEmail: string | null;
  paymentMethod: string | null;
  receiptUrl: string | null;
}

function PaymentResultContent() {
  const t = useTranslations("PaymentResult");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentData, setPaymentData] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentResult = async () => {
      if (!sessionId) {
        setError(t("invalidSession"));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/stripe/result?session_id=${encodeURIComponent(sessionId)}`);

        if (!response.ok) {
          throw new Error(t("fetchError"));
        }

        setPaymentData(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : t("fetchError"));
        console.error("Failed to fetch payment result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentResult();
  }, [sessionId, t]);

  const isSuccess = paymentData?.paymentStatus === "paid"
    || paymentData?.paymentStatus === "no_payment_required";
  const amount = paymentData?.amountTotal != null && paymentData.currency
    ? formatStripeAmount(paymentData.amountTotal, paymentData.currency, locale)
    : null;
  const transactionTime = paymentData
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(paymentData.createdAt))
    : null;

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-background border-none mx-auto shadow-sm">
        <CardHeader className="space-y-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-3"
          >
            <div className={`rounded-full p-3 shadow-sm ${isSuccess ? "bg-green-50" : error ? "bg-red-50" : "bg-yellow-50"}`}>
              {error
                ? (
                    <XCircle className="h-12 w-12 text-red-500" />
                  )
                : isSuccess
                  ? (
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    )
                  : (
                      <CheckCircle2 className="h-12 w-12 text-yellow-500" />
                    )}
            </div>
          </motion.div>
          <CardTitle className="text-2xl font-bold text-center">
            {error ? t("errorTitle") : isSuccess ? t("successTitle") : t("processingTitle")}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {error || (isSuccess ? t("successDescription") : t("processingDescription"))}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading
            ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground text-sm">{t("amount")}</span>
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">{t("sessionId")}</span>
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CalendarClock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t("transactionTime")}</p>
                        <Skeleton className="h-4 w-40 mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            : error
              ? (
                  <div className="py-6 text-center">
                    <p className="text-muted-foreground">{t("errorDescription")}</p>
                  </div>
                )
              : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">{t("amount")}</span>
                        <span className="text-2xl font-bold">{amount}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CalendarClock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{t("transactionTime")}</p>
                          <p className="text-xs text-muted-foreground">{transactionTime}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Receipt className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{t("sessionId")}</p>
                          <p className="text-xs text-muted-foreground break-all">{sessionId}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-5" />

                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 px-3 py-1.5 ${
                          isSuccess
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-yellow-50 text-yellow-600 border-yellow-200"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isSuccess
                          ? t("transactionComplete")
                          : t("statusLabel", { status: paymentData?.paymentStatus ?? "processing" })}
                      </Badge>
                    </div>
                  </motion.div>
                )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full gap-3 flex"
          >
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("backToHome")}
              </Link>
            </Button>
            {isSuccess && !loading && paymentData?.receiptUrl && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => paymentData.receiptUrl && window.open(paymentData.receiptUrl, "_blank")}
              >
                <Download className="h-4 w-4 mr-1" />
                {t("viewReceipt")}
              </Button>
            )}
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function PaymentResultFallback() {
  const t = useTranslations("PaymentResult");

  return (
    <div className="w-full max-w-md">
      <Card className="bg-background border-none mx-auto shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-3">
            <div className="rounded-full p-3 shadow-sm bg-yellow-50">
              <CalendarClock className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("loadingTitle")}
          </CardTitle>
          <p className="text-center text-muted-foreground">
            {t("loadingDescription")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground text-sm">{t("amount")}</span>
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">{t("sessionId")}</span>
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex-1">
        <div className="flex min-h-screen w-full">
          <div className="w-full bg-background flex items-center justify-center p-6">
            <Suspense fallback={<PaymentResultFallback />}>
              <PaymentResultContent />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
