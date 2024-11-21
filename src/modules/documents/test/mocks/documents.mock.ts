import { faker } from '@faker-js/faker';
import { CreateDocumentDto } from '../../dto/create-document.dto';
import {
  DocumentOriginEnum,
  DocumentTypeEnum,
} from '../../../../database/schema';
import { IDocument } from '../../interfaces/documents.interface';

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

export const MockIDocument: IDocument = {
  ...MockCreateDocumentDto,
  id: faker.string.uuid(),
  fileUrl: faker.internet.url(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};
