import { Injectable } from '@nestjs/common';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import { AppError } from 'src/common/errors/Error';
import { ICreateDocument, IDocument } from '../interfaces/documents.interface';
import {
  mapCamelCaseToSnakeCase,
  mapSnakeCaseToCamelCase,
} from 'src/modules/utils/document_utils';

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
}
