import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { AppError } from '../../../common/errors/Error';
import { MinioService } from '../../../common/aws/minio.service';
import {
  convertStringsToNumbers,
  normalizeFileName,
} from '../../../modules/utils/document_utils';
import { IDocument } from '../interfaces/documents.interface';

@Injectable()
export class CreateDocumentService {
  constructor(
    @Inject('IDocumentsRepository')
    private readonly documentsRepository: IDocumentsRepository,
    private readonly minioService: MinioService,
  ) {}

  private validateCreateDocument(
    createDocument: CreateDocumentDto,
    file: Express.Multer.File,
  ): void {
    if (!file) {
      throw new AppError(
        'documents-service.createDocument',
        400,
        'file is required',
      );
    }

    if (createDocument.totalTaxes < 0 || createDocument.netValue < 0) {
      throw new AppError(
        'documents-service.createDocument',
        400,
        'values cannot be negatived',
      );
    }
  }

  async execute(
    createDocument: CreateDocumentDto,
    file: Express.Multer.File,
  ): Promise<IDocument> {
    const BUCKET_NAME = process.env.MINIO_BUCKET || '';

    this.validateCreateDocument(createDocument, file);

    const normalizedFileName = normalizeFileName(file.originalname);

    try {
      const uploadedFile = await this.minioService.uploadFile(
        BUCKET_NAME,
        normalizedFileName,
        file.buffer,
      );

      const data = await this.documentsRepository.createDocument({
        ...createDocument,
        bucketFileName: normalizedFileName,
        fileUrl: uploadedFile.Location,
      });

      return convertStringsToNumbers(data) as IDocument;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'documents-service.createDocument',
        400,
        'failed to create document',
      );
    }
  }
}
