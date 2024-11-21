import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { AppError } from '../../../common/errors/Error';
import { MinioService } from '../../../common/aws/minio.service';
import { normalizeFileName } from 'src/modules/utils/document_utils';
import { IDocument } from '../interfaces/documents.interface';
import { DocumentOriginEnum, DocumentTypeEnum } from 'src/database/schema';

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
        fileUrl: uploadedFile.Location,
      });

      const createdDocument = {
        id: data.id,
        documentName: data.documentName,
        issuer: data.issuer,
        documentOrigin: data.documentOrigin as DocumentOriginEnum,
        documentType: data.documentType as DocumentTypeEnum,
        totalTaxes: parseFloat(data.totalTaxes as unknown as string),
        netValue: parseFloat(data.netValue as unknown as string),
        fileUrl: data.fileUrl,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      return createdDocument;
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
