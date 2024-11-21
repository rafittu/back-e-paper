import { Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { AppError } from '../../../common/errors/Error';
import { MinioService } from '../../../common/aws/minio.service';
import { normalizeFileName } from 'src/modules/utils/document_utils';

@Injectable()
export class CreateDocumentService {
  constructor(
    private readonly documentsRepository: IDocumentsRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(dto: CreateDocumentDto, file: Express.Multer.File) {
    const BUCKET_NAME = process.env.MINIO_BUCKET || '';

    if (!file) {
      throw new AppError(
        'documents-service.createDocument',
        400,
        'file is required',
      );
    }

    if (dto.totalTaxes < 0 || dto.netValue < 0) {
      throw new AppError(
        'documents-service.createDocument',
        400,
        'values cannot be negatived',
      );
    }

    try {
      const normalizedFileName = normalizeFileName(file.originalname);
      const uploadedFile = await this.minioService.uploadFile(
        BUCKET_NAME,
        normalizedFileName,
        file.buffer,
      );

      const document = await this.documentsRepository.createDocument(
        dto,
        uploadedFile.Location,
      );

      return document;
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
