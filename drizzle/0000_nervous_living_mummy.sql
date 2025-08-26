CREATE TYPE "public"."subscription_status" AS ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"sign_up_ip_address" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"password_hash" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"avatar" text
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"subscription_id" text,
	"status" "subscription_status",
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean,
	"payment_method_brand" text,
	"payment_method_last_4" text,
	CONSTRAINT "user_subscriptions_customer_id_unique" UNIQUE("customer_id"),
	CONSTRAINT "user_subscriptions_subscription_id_unique" UNIQUE("subscription_id")
);
--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;