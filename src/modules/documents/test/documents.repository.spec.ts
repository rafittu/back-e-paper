import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsRepository } from '../repository/document.repository';
import { db } from '../../../database/db';
import { documents } from '../../../database/schema';
import {
  MockCreateDocumentInterface,
  MockDocumentsList,
  MockIDocument,
  MockInsertResponse,
  MockUpdateDocumentDto,
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

  describe('find documents by filter', () => {
    it('should retrieve documents from the database', async () => {
      const mockFilters = { issuer: MockIDocument.issuer };
      const mockSelect = jest.fn().mockResolvedValueOnce(MockDocumentsList);

      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockImplementation(() => mockSelect()),
      }));

      const result = await repository.findDocumentsByFilter(mockFilters);

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockDocumentsList);
    });

    it('should return all documents if no filters are provided', async () => {
      const mockSelect = jest.fn().mockResolvedValueOnce(MockDocumentsList);

      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnValue(mockSelect()),
      }));

      const result = await repository.findDocumentsByFilter({});

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockDocumentsList);
    });

    it('should throw an error if retrieving documents fails', async () => {
      const mockFilters = { issuer: MockIDocument.issuer };
      const mockSelect = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockImplementation(() => mockSelect()),
      }));

      try {
        await repository.findDocumentsByFilter(mockFilters);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toContain('failed to filter documents');
        expect(error.code).toBe(500);
      }
    });
  });

  describe('find document by id', () => {
    it('should return a document by id', async () => {
      const mockSelect = jest.fn().mockResolvedValueOnce([MockInsertResponse]);
      (db.select as jest.Mock).mockImplementation(() => ({
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnValue(mockSelect()),
      }));

      const result = await repository.findDocumentById(MockIDocument.id);

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIDocument);
    });

    it('should throw an error if retrieving document fails', async () => {
      const mockSelect = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      (db.select as jest.Mock).mockImplementation(mockSelect);

      try {
        await repository.findDocumentById(MockIDocument.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(
          'failed to retrieve document by id. Error: Database error',
        );
        expect(error.code).toBe(500);
      }
    });
  });

  describe('update document', () => {
    it('should update a document successfully', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValueOnce([MockInsertResponse]),
      });

      (db.update as jest.Mock).mockImplementation(mockUpdate);

      const snackCaseData = mapCamelCaseToSnakeCase(MockUpdateDocumentDto);

      const result = await repository.updateDocument(
        MockIDocument.id,
        MockUpdateDocumentDto,
      );

      expect(db.update).toHaveBeenCalledWith(documents);
      expect(mockUpdate().set).toHaveBeenCalledWith(snackCaseData);
      expect(result).toEqual(MockIDocument);
    });

    it('should throw an error if update fails', async () => {
      const mockUpdate = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      (db.update as jest.Mock).mockImplementation(mockUpdate);

      try {
        await repository.updateDocument(
          MockIDocument.id,
          MockUpdateDocumentDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(
          'failed to update document in database. Error: Database error',
        );
        expect(error.code).toBe(500);
      }
    });
  });

  describe('delete document', () => {
    it('should delete a document successfully', async () => {
      const mockDelete = jest.fn().mockResolvedValueOnce({ rowCount: 1 });
      (db.delete as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnValue(mockDelete()),
      }));

      await repository.deleteDocument(MockIDocument.id);

      expect(db.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      const mockDelete = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      (db.delete as jest.Mock).mockImplementation(mockDelete);

      try {
        await repository.deleteDocument(MockIDocument.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe(
          'failed to delete document. Error: Database error',
        );
        expect(error.code).toBe(500);
      }
    });
  });
});
