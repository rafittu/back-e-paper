import { Document } from '../../../database/schema';
import { CreateDocumentDto } from '../dto/create-document.dto';

export interface IDocumentsRepository<> {
  createDocument(data: CreateDocumentDto, fileUrl: string): Promise<Document>;
}
