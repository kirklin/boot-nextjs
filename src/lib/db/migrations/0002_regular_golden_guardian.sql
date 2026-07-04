CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_checkout_session_id" text NOT NULL,
	"stripe_payment_intent_id" text,
	"product_key" text,
	"amount_total" integer,
	"currency" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id")
);
--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "cancel_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "canceled_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "ended_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "billing_interval" text;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "stripe_schedule_id" text;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "limits" jsonb;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;