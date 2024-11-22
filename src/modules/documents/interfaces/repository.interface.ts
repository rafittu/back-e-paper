import { ICreateDocument, IDocument } from './documents.interface';

export interface IDocumentsRepository<> {
  createDocument(data: ICreateDocument): Promise<IDocument>;
  findAllDocuments(): Promise<IDocument[]>;
  updateDocument(
    id: string,
    data: Partial<ICreateDocument>,
  ): Promise<IDocument>;
  findDocumentById(id: string): Promise<IDocument>;
}
