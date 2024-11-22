import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { IDocument } from '../interfaces/documents.interface';
import { AppError } from 'src/common/errors/Error';
import { convertStringsToNumbers } from 'src/modules/utils/document_utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateDocumentService {
  constructor(
    @Inject('IDocumentsRepository')
    private readonly documentsRepository: IDocumentsRepository,
  ) {}

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
      const document = plainToInstance(Object, updateDocumentDto);

      const updatedDocument = await this.documentsRepository.updateDocument(
        id,
        document,
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
