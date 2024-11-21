import { Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { AppError } from 'src/common/errors/Error';

@Injectable()
export class CreateDocumentService {
  constructor(private readonly documentsRepository: IDocumentsRepository) {}

  async execute(dto: CreateDocumentDto, file: Express.Multer.File) {
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
      const fileUrlLocation = 'file url location';

      const document = await this.documentsRepository.createDocument(
        dto,
        fileUrlLocation,
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
