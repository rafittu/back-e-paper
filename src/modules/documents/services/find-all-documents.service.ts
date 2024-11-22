import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { convertStringsToNumbers } from '../../utils/document-utils';
import { IDocument } from '../interfaces/documents.interface';

@Injectable()
export class FindAllDocumentsService {
  constructor(
    @Inject('IDocumentsRepository')
    private readonly documentsRepository: IDocumentsRepository,
  ) {}

  async execute(): Promise<IDocument[]> {
    try {
      const documents = await this.documentsRepository.findAllDocuments();
      return convertStringsToNumbers(documents) as IDocument[];
    } catch (error) {
      throw error;
    }
  }
}
