CREATE TYPE "public"."document_origin_enum" AS ENUM('scanned', 'electronic');--> statement-breakpoint
CREATE TYPE "public"."document_type_enum" AS ENUM('contract', 'invoice');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_name" text NOT NULL,
	"issuer" text NOT NULL,
	"document_origin" "document_origin_enum" NOT NULL,
	"document_type" "document_type_enum" NOT NULL,
	"total_taxes" numeric(12, 2) NOT NULL,
	"net_value" numeric(12, 2) NOT NULL,
	"file_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
