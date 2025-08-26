CREATE TYPE "public"."subscription_statuses" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "stripe_customer_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" "subscription_statuses";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_period_end" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_subscription_renewal_date" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_price_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id");