import { Injectable } from '@nestjs/common';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import { AppError } from '../../../common/errors/Error';
import { ICreateDocument, IDocument } from '../interfaces/documents.interface';
import {
  mapCamelCaseToSnakeCase,
  mapSnakeCaseToCamelCase,
} from '../../../modules/utils/document_utils';
import { eq } from 'drizzle-orm';

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

  async findDocumentById(id: string): Promise<IDocument> {
    try {
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id))
        .limit(1);

      return mapSnakeCaseToCamelCase(document);
    } catch (error) {
      throw new AppError(
        'documents-repository.findDocumentById',
        500,
        `failed to retrieve document by id. ${error}`,
      );
    }
  }

  async updateDocument(
    id: string,
    data: Partial<ICreateDocument>,
  ): Promise<IDocument> {
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
}
