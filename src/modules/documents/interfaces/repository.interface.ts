import { FilterDocumentsDto } from '../dto/filter-documents.dto';
import {
  ICreateDocument,
  IDocument,
  IUpdateDocument,
} from './documents.interface';

export interface IDocumentsRepository<> {
  createDocument(data: ICreateDocument): Promise<IDocument>;
  findAllDocuments(): Promise<IDocument[]>;
  findDocumentsByFilter(filters: FilterDocumentsDto): Promise<IDocument[]>;
  updateDocument(id: string, data: IUpdateDocument): Promise<IDocument>;
  findDocumentById(id: string): Promise<IDocument>;
  deleteDocument(id: string): Promise<void>;
}
