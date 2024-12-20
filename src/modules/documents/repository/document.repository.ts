import { Injectable } from '@nestjs/common';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import { AppError } from '../../../common/errors/Error';
import {
  ICreateDocument,
  IDocument,
  IUpdateDocument,
} from '../interfaces/documents.interface';
import {
  mapCamelCaseToSnakeCase,
  mapSnakeCaseToCamelCase,
} from '../../utils/document-utils';
import { FilterDocumentsDto } from '../dto/filter-documents.dto';
import { and, eq } from 'drizzle-orm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DocumentsRepository {
  async createDocument(data: ICreateDocument): Promise<IDocument> {
    const snakeCasedData = mapCamelCaseToSnakeCase(data);

    try {
      const [insertedDocument] = await db
        .insert(documents)
        .values(snakeCasedData)
        .returning();

      return mapSnakeCaseToCamelCase(insertedDocument);
    } catch (error) {
      throw new AppError(
        'documents-repository.createDocument',
        500,
        `failed to insert document into database. ${error}`,
      );
    }
  }

  async findAllDocuments(): Promise<IDocument[]> {
    try {
      const allDocuments = await db.select().from(documents);
      return allDocuments.map(mapSnakeCaseToCamelCase);
    } catch (error) {
      throw new AppError(
        'documents-repository.findAllDocuments',
        500,
        `failed to get documents from database. ${error}`,
      );
    }
  }

  async findDocumentsByFilter(
    filters: FilterDocumentsDto,
  ): Promise<IDocument[]> {
    const filtersData = plainToInstance(Object, filters);
    const snakeCaseFilters = mapCamelCaseToSnakeCase(filtersData);

    try {
      const conditions: any[] = [];

      Object.entries(snakeCaseFilters).forEach(([key, value]) => {
        if (value !== undefined && key in documents) {
          conditions.push(eq(documents[key], value));
        }
      });

      const query =
        conditions.length > 0
          ? db
              .select()
              .from(documents)
              .where(and(...conditions))
          : db.select().from(documents);

      const results = await query;
      return results.map(mapSnakeCaseToCamelCase);
    } catch (error) {
      throw new AppError(
        'documents-repository.findDocumentsByFilter',
        500,
        `failed to filter documents. ${error}`,
      );
    }
  }

  async findDocumentById(id: string): Promise<IDocument> {
    try {
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id));

      return mapSnakeCaseToCamelCase(document);
    } catch (error) {
      throw new AppError(
        'documents-repository.findDocumentById',
        500,
        `failed to retrieve document by id. ${error}`,
      );
    }
  }

  async updateDocument(id: string, data: IUpdateDocument): Promise<IDocument> {
    const snakeCasedData = mapCamelCaseToSnakeCase(data);

    try {
      const [updatedDocument] = await db
        .update(documents)
        .set(snakeCasedData)
        .where(eq(documents.id, id))
        .returning();

      return mapSnakeCaseToCamelCase(updatedDocument);
    } catch (error) {
      throw new AppError(
        'documents-repository.updateDocument',
        500,
        `failed to update document in database. ${error}`,
      );
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await db.delete(documents).where(eq(documents.id, id));
    } catch (error) {
      throw new AppError(
        'documents-repository.deleteDocument',
        500,
        `failed to delete document. ${error}`,
      );
    }
  }
}
