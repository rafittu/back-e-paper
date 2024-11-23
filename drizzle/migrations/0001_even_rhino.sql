ALTER TYPE "public"."document_origin_enum" RENAME TO "document_origin";--> statement-breakpoint
ALTER TYPE "public"."document_type_enum" RENAME TO "document_type";--> statement-breakpoint
ALTER TABLE "public"."documents" ALTER COLUMN "document_origin" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."document_origin";--> statement-breakpoint
CREATE TYPE "public"."document_origin" AS ENUM('SCANNED', 'ELECTRONIC');--> statement-breakpoint
ALTER TABLE "public"."documents" ALTER COLUMN "document_origin" SET DATA TYPE "public"."document_origin" USING "document_origin"::"public"."document_origin";--> statement-breakpoint
ALTER TABLE "public"."documents" ALTER COLUMN "document_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."document_type";--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('CONTRACT', 'INVOICE');--> statement-breakpoint
ALTER TABLE "public"."documents" ALTER COLUMN "document_type" SET DATA TYPE "public"."document_type" USING "document_type"::"public"."document_type";