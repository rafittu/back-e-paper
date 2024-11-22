import { Inject, Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import { convertStringsToNumbers } from '../../utils/document-utils';
import { IDocument } from '../interfaces/documents.interface';
import { FilterDocumentsDto } from '../dto/filter-documents.dto';

@Injectable()
export class DocumentsByFilterService {
  constructor(
    @Inject('IDocumentsRepository')
    private readonly documentsRepository: IDocumentsRepository,
  ) {}

  async execute(filters: FilterDocumentsDto): Promise<IDocument[]> {
    try {
      const documents =
        await this.documentsRepository.findDocumentsByFilter(filters);

      return convertStringsToNumbers(documents) as IDocument[];
    } catch (error) {
      throw error;
    }
  }
}
