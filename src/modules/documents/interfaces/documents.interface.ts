import { DocumentOriginEnum, DocumentTypeEnum } from '../../../database/schema';

export interface ICreateDocument {
  documentName: string;
  issuer: string;
  documentOrigin: DocumentOriginEnum;
  documentType: DocumentTypeEnum;
  totalTaxes: number;
  netValue: number;
  bucketFileName: string;
  fileUrl: string;
}

export interface IUpdateDocument {
  documentName?: string;
  issuer?: string;
  documentOrigin?: DocumentOriginEnum;
  documentType?: DocumentTypeEnum;
  totalTaxes?: number;
  netValue?: number;
  bucketFileName?: string;
  fileUrl?: string;
}

export interface IDocument extends ICreateDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
