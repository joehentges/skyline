CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"date_updated" timestamp DEFAULT now(),
	"sign_up_ip_address" text,
	"role" text DEFAULT 'user' NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"password_hash" text,
	"display_name" text NOT NULL,
	"avatar" text
);
