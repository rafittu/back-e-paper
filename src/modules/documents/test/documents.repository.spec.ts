import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsRepository } from '../repository/document.repository';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import {
  MockCreateDocumentInterface,
  MockIDocument,
  MockInsertResponse,
} from './mocks/documents.mock';
import { mapCamelCaseToSnakeCase } from '../../../modules/utils/document_utils';
import { AppError } from '../../../common/errors/Error';

jest.mock('../../../database/db');

describe('DocumentsRepository', () => {
  let repository: DocumentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsRepository],
    }).compile();

    repository = module.get<DocumentsRepository>(DocumentsRepository);
  });

  beforeEach(() => {
    repository = new DocumentsRepository();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createDocument', () => {
    it('should successfully insert document and return the document', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([MockInsertResponse]),
      });

      (db.insert as jest.Mock).mockImplementation(mockInsert);

      const snackCaseData = mapCamelCaseToSnakeCase(
        MockCreateDocumentInterface,
      );

      const result = await repository.createDocument(
        MockCreateDocumentInterface,
      );

      expect(db.insert).toHaveBeenCalledWith(documents);
      expect(mockInsert().values).toHaveBeenCalledWith(snackCaseData);

      expect(result).toEqual(MockIDocument);
    });

    it('should throw an error when insertion fails', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnThis(),
        returning: jest
          .fn()
          .mockRejectedValueOnce(new Error('Database insert failed')),
      });

      (db.insert as jest.Mock).mockImplementation(mockInsert);

      try {
        await repository.createDocument(MockCreateDocumentInterface);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(
          'failed to insert document into database. Error: Database insert failed',
        );
        expect(error.code).toBe(500);
      }
    });
  });
});
