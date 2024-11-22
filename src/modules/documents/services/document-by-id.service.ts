import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { parseDocumentNumbers } from '../../../modules/utils/document_utils';
import { IDocument } from '../interfaces/documents.interface';

@Injectable()
export class FindDocumentByIdService {
  constructor(
    @Inject('IDocumentsRepository')
    private readonly documentsRepository: IDocumentsRepository,
  ) {}

  async execute(id: string): Promise<IDocument> {
    try {
      const document = await this.documentsRepository.findDocumentById(id);
      return parseDocumentNumbers(document) as IDocument;
    } catch (error) {
      throw error;
    }
  }
}
