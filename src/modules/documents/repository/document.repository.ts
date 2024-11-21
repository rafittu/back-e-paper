import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { db } from '../../../database/db';
import { documents, NewDocument } from '../../../database/schema';
import { CreateDocumentDto } from '../dto/create-document.dto';

@Injectable()
export class DocumentsRepository {
  private toCamelCase(obj: Record<string, any>): Document {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, char) => char.toUpperCase()),
        value,
      ]),
    ) as Document;
  }

  async createDocument(
    data: CreateDocumentDto,
    fileUrl: string,
  ): Promise<Document> {
    const snakeCasedData: NewDocument = {
      document_name: data.documentName,
      issuer: data.issuer,
      document_origin: data.documentOrigin,
      document_type: data.documentType,
      total_taxes: data.totalTaxes.toString(),
      net_value: data.netValue.toString(),
      file_url: fileUrl,
    };

    try {
      const [insertedDocument] = await db
        .insert(documents)
        .values(snakeCasedData)
        .returning();

      return this.toCamelCase(insertedDocument);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to insert document into database',
      );
    }
  }
}
