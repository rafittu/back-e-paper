import {
  ICreateDocument,
  IDocument,
  IUpdateDocument,
} from './documents.interface';

export interface IDocumentsRepository<> {
  createDocument(data: ICreateDocument): Promise<IDocument>;
  findAllDocuments(): Promise<IDocument[]>;
  updateDocument(id: string, data: IUpdateDocument): Promise<IDocument>;
  findDocumentById(id: string): Promise<IDocument>;
}
