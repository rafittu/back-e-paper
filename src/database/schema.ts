import {
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const documentOriginEnum = pgEnum('document_origin_enum', [
  'SCANNED',
  'ELECTRONIC',
]);
export enum DocumentOriginEnum {
  SCANNED = 'SCANNED',
  ELECTRONIC = 'ELECTRONIC',
}

export const documentTypeEnum = pgEnum('document_type_enum', [
  'CONTRACT',
  'INVOICE',
]);
export enum DocumentTypeEnum {
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
}

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  document_name: text('document_name').notNull(),
  issuer: text('issuer').notNull(),
  document_origin: documentOriginEnum('document_origin').notNull(),
  document_type: documentTypeEnum('document_type').notNull(),
  total_taxes: decimal('total_taxes', { precision: 12, scale: 2 }).notNull(),
  net_value: decimal('net_value', { precision: 12, scale: 2 }).notNull(),
  file_url: text('file_url'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;
