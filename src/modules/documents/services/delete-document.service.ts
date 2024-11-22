import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { MinioService } from '../../../common/aws/minio.service';

@Injectable()
export class DeleteDocumentService {
  constructor(
    @Inject('IDocumentsRepository')
    private readonly documentsRepository: IDocumentsRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(id: string): Promise<void> {
    const BUCKET_NAME = process.env.MINIO_BUCKET || '';

    try {
      const document = await this.documentsRepository.findDocumentById(id);

      if (!document) {
        throw new AppError(
          'documents-service.deleteDocument',
          400,
          'invalid document id',
        );
      }

      await this.minioService.deleteFile(BUCKET_NAME, document.bucketFileName);

      await this.documentsRepository.deleteDocument(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'documents-service.deleteDocument',
        400,
        'failed to delete document',
      );
    }
  }
}
