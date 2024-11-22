import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { IDocument, IUpdateDocument } from '../interfaces/documents.interface';
import { AppError } from '../../../common/errors/Error';
import {
  normalizeFileName,
  parseDocumentNumbers,
} from '../../../modules/utils/document_utils';
import { plainToInstance } from 'class-transformer';
import { MinioService } from 'src/common/aws/minio.service';

@Injectable()
export class UpdateDocumentService {
  constructor(
    @Inject('IDocumentsRepository')
    private readonly documentsRepository: IDocumentsRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<IDocument> {
    const BUCKET_NAME = process.env.MINIO_BUCKET || '';

    let document: IUpdateDocument = {};

    if (updateDocumentDto.totalTaxes < 0 || updateDocumentDto.netValue < 0) {
      throw new AppError(
        'documents-service.updateDocument',
        400,
        'values cannot be negatived',
      );
    }

    if (updateDocumentDto.documentName) {
      const existingDocument =
        await this.documentsRepository.findDocumentById(id);

      const newNormalizedFileName = normalizeFileName(
        updateDocumentDto.documentName,
      );

      await this.minioService.renameFile(
        BUCKET_NAME,
        existingDocument.bucketFileName,
        newNormalizedFileName,
      );

      document.bucketFileName = newNormalizedFileName;
    }

    try {
      const documentData = plainToInstance(Object, updateDocumentDto);

      document = {
        ...document,
        ...documentData,
      };

      const updatedDocument = await this.documentsRepository.updateDocument(
        id,
        document,
      );

      return parseDocumentNumbers(updatedDocument) as IDocument;
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
