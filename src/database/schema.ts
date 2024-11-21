import {
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const documentOrigin = pgEnum('document_origin', [
  'SCANNED',
  'ELECTRONIC',
]);
export enum DocumentOriginEnum {
  SCANNED = 'SCANNED',
  ELECTRONIC = 'ELECTRONIC',
}

export const documentType = pgEnum('document_type', ['CONTRACT', 'INVOICE']);
export enum DocumentTypeEnum {
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
}

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    document_name: text('document_name').notNull(),
    issuer: text('issuer').notNull(),
    document_origin: documentOrigin('document_origin').notNull(),
    document_type: documentType('document_type').notNull(),
    total_taxes: decimal('total_taxes', { precision: 12, scale: 2 }).notNull(),
    net_value: decimal('net_value', { precision: 12, scale: 2 }).notNull(),
    file_url: text('file_url'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    uniqueDocumentNamePerIssuer: uniqueIndex(
      'unique_document_name_per_issuer',
    ).on(table.document_name, table.issuer),
  }),
);

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;
