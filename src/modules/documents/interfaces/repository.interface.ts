import { FilterDocumentsDto } from '../dto/filter-documents.dto';
import { ICreateDocument, IDocument } from './documents.interface';

export interface IDocumentsRepository<> {
  createDocument(data: ICreateDocument): Promise<IDocument>;
  findAllDocuments(): Promise<IDocument[]>;
  findDocumentsByFilter(filters: FilterDocumentsDto): Promise<IDocument[]>;
}
