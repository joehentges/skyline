CREATE TYPE "public"."authentication_type" AS ENUM('password', 'magic-link');--> statement-breakpoint
CREATE TYPE "public"."token_type" AS ENUM('magic-link', 'password-reset', 'email-verification');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"authentication_type" "authentication_type" NOT NULL,
	"city" text,
	"continent" text,
	"country" text,
	"user_agent" text,
	"ip" text
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"type" "token_type" NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "kv_store" CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;