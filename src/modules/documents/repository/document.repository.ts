import { Injectable } from '@nestjs/common';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import { AppError } from '../../../common/errors/Error';
import { ICreateDocument, IDocument } from '../interfaces/documents.interface';
import {
  mapCamelCaseToSnakeCase,
  mapSnakeCaseToCamelCase,
} from '../../utils/document-utils';
import { FilterDocumentsDto } from '../dto/filter-documents.dto';

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
    let query;

    try {
      query = db.select().from(documents);

      Object.entries(filters).forEach(([key, value]) => {
        if (value && key in documents) {
          query = query.where(documents[key].eq(value));
        }
      });

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
}
