import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "~/lib/stripe/server";

export async function GET(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
  }

  try {
    // 获取Stripe会话信息
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 获取支付意图详情
    let paymentIntent = null;
    if (session.payment_intent) {
      paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    }

    // 获取订阅信息（如果是订阅类型的支付）
    let subscription = null;
    if (session.subscription) {
      subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    }

    // 格式化日期和时间
    const createdAt = new Date(session.created * 1000);
    const date = createdAt.toLocaleDateString();
    const time = createdAt.toLocaleTimeString();

    // 构建响应数据
    const result = {
      success: session.payment_status === "paid",
      orderId: session.id.substring(0, 8).toUpperCase(),
      amount: new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: session.currency?.toUpperCase() || "CNY",
      }).format((session.amount_total || 0) / 100),
      date,
      time,
      status: session.payment_status,
      customer: session.customer,
      paymentMethod: paymentIntent?.payment_method_types?.[0] || null,
      subscriptionStatus: subscription?.status || null,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error retrieving payment result:", err);
    if (err instanceof Stripe.errors.StripeError) {
      const { message, type } = err;
      return NextResponse.json({ error: { message, type } }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to retrieve payment information" }, { status: 500 });
  }
}
