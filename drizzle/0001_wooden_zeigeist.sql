ALTER TABLE "users" ALTER COLUMN "date_created" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "date_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";