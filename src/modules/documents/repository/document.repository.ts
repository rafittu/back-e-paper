import { Injectable } from '@nestjs/common';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import { AppError } from 'src/common/errors/Error';
import { ICreateDocument, IDocument } from '../interfaces/documents.interface';

@Injectable()
export class DocumentsRepository {
  private mapCamelCaseToSnakeCase = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map((item) => this.mapCamelCaseToSnakeCase(item));
    } else if (data !== null && data.constructor === Object) {
      return Object.keys(data).reduce((result: any, key: string) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        result[snakeKey] = this.mapCamelCaseToSnakeCase(data[key]);
        return result;
      }, {});
    }
    return data;
  };

  private mapSnakeCaseToCamelCase = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map((item) => this.mapSnakeCaseToCamelCase(item));
    } else if (data !== null && data.constructor === Object) {
      return Object.keys(data).reduce((result: any, key: string) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        result[camelKey] = this.mapSnakeCaseToCamelCase(data[key]);
        return result;
      }, {});
    }
    return data;
  };

  async createDocument(data: ICreateDocument): Promise<IDocument> {
    const snakeCasedData = this.mapCamelCaseToSnakeCase(data);

    try {
      const [insertedDocument] = await db
        .insert(documents)
        .values(snakeCasedData)
        .returning();

      return this.mapSnakeCaseToCamelCase(insertedDocument);
    } catch (error) {
      throw new AppError(
        'documents-repository.createDocument',
        500,
        `failed to insert document into database. ${error}`,
      );
    }
  }
}
