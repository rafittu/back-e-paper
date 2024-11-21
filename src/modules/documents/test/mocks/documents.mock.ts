import { faker } from '@faker-js/faker';
import { CreateDocumentDto } from '../../dto/create-document.dto';
import {
  DocumentOriginEnum,
  DocumentTypeEnum,
} from '../../../../database/schema';
import {
  ICreateDocument,
  IDocument,
} from '../../interfaces/documents.interface';

export const MockCreateDocumentDto: CreateDocumentDto = {
  documentName: faker.finance.accountName(),
  issuer: faker.person.fullName(),
  documentOrigin: DocumentOriginEnum.ELECTRONIC,
  documentType: DocumentTypeEnum.CONTRACT,
  totalTaxes: parseFloat(faker.finance.amount()),
  netValue: parseFloat(faker.finance.amount()),
};

export const MockDocumentFile = {
  fieldname: 'file',
  originalname: 'test.pdf',
  encoding: 'binary',
  mimetype: 'application/pdf',
  buffer: Buffer.from('PDF file content here'),
  size: 1024,
} as Express.Multer.File;

export const MockCreateDocumentInterface: ICreateDocument = {
  ...MockCreateDocumentDto,
  fileUrl: faker.internet.url(),
};

export const MockInsertResponse = {
  id: faker.string.uuid(),
  document_name: MockCreateDocumentInterface.documentName,
  issuer: MockCreateDocumentInterface.issuer,
  document_origin: MockCreateDocumentInterface.documentOrigin,
  document_type: MockCreateDocumentInterface.documentType,
  total_taxes: MockCreateDocumentInterface.totalTaxes,
  net_value: MockCreateDocumentInterface.netValue,
  file_url: MockCreateDocumentInterface.fileUrl,
  created_at: faker.date.past(),
  updated_at: faker.date.recent(),
};

export const MockIDocument: IDocument = {
  ...MockCreateDocumentInterface,
  id: MockInsertResponse.id,
  createdAt: MockInsertResponse.created_at,
  updatedAt: MockInsertResponse.updated_at,
};
