import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsRepository } from '../repository/document.repository';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import {
  MockCreateDocumentInterface,
  MockDocumentsList,
  MockIDocument,
  MockInsertResponse,
} from './mocks/documents.mock';
import { mapCamelCaseToSnakeCase } from '../../utils/document-utils';
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

  describe('create document', () => {
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

  describe('find all documents', () => {
    it('should retrieve all documents from the database', async () => {
      const mockSelect = jest.fn().mockResolvedValue(MockDocumentsList);
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnValue(mockSelect()),
      }));

      const result = await repository.findAllDocuments();

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockDocumentsList);
    });

    it('should throw an error if retrieving documents fails', async () => {
      const mockSelect = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      (db.select as jest.Mock).mockImplementation(mockSelect);

      try {
        await repository.findAllDocuments();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(
          'failed to get documents from database. Error: Database error',
        );
        expect(error.code).toBe(500);
      }
    });
  });
});
