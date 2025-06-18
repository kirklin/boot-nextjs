import Stripe from "stripe";
import { env } from "~/config/server";

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
    typescript: true,
  })
  : null;
