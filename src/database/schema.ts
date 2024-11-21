import {
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const DocumentOriginEnum = pgEnum('document_origin_enum', [
  'SCANNED',
  'ELECTRONIC',
]);
export type DocumentOriginEnum = 'SCANNED' | 'ELECTRONIC';

export const DocumentTypeEnum = pgEnum('document_type_enum', [
  'CONTRACT',
  'INVOICE',
]);
export type DocumentTypeEnum = 'CONTRACT' | 'INVOICE';

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  document_name: text('document_name').notNull(),
  issuer: text('issuer').notNull(),
  document_origin: DocumentOriginEnum('document_origin').notNull(),
  document_type: DocumentTypeEnum('document_type').notNull(),
  total_taxes: decimal('total_taxes', { precision: 12, scale: 2 }).notNull(),
  net_value: decimal('net_value', { precision: 12, scale: 2 }).notNull(),
  file_url: text('file_url'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;
