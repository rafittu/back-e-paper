import { Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { IDocument } from '../interfaces/documents.interface';
import { AppError } from 'src/common/errors/Error';
import { convertStringsToNumbers } from 'src/modules/utils/document_utils';

@Injectable()
export class UpdateDocumentService {
  constructor(private readonly documentsRepository: IDocumentsRepository) {}

  async execute(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<IDocument> {
    if (updateDocumentDto.totalTaxes < 0 || updateDocumentDto.netValue < 0) {
      throw new AppError(
        'documents-service.updateDocument',
        400,
        'values cannot be negatived',
      );
    }

    try {
      const updatedDocument = await this.documentsRepository.updateDocument(
        id,
        updateDocumentDto,
      );

      return convertStringsToNumbers(updatedDocument) as IDocument;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'documents-service.updateDocument',
        400,
        'failed to update document',
      );
    }
  }
}
