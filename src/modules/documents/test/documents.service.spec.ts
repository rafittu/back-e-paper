import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentService } from '../services/create-document.service';
import { MinioService } from '../../../common/aws/minio.service';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import {
  MockCreateDocumentDto,
  MockDocumentFile,
  MockDocumentsList,
  MockIDocument,
  MockUpdatedDocument,
  MockUpdateDocumentDto,
} from './mocks/documents.mock';
import { AppError } from '../../../common/errors/Error';
import { FindAllDocumentsService } from '../services/find-all-documents.service';
import { UpdateDocumentService } from '../services/update-document.service';
import { DocumentByIdService } from '../services/document-by-id.service';
import { DeleteDocumentService } from '../services/delete-document.service';
import { DocumentsByFilterService } from '../services/documents-by-filter.service';

describe('DocumentsService', () => {
  let createDocument: CreateDocumentService;
  let findAllDocuments: FindAllDocumentsService;
  let findDocumentsByFilter: DocumentsByFilterService;
  let findDocumentById: DocumentByIdService;
  let updateDocument: UpdateDocumentService;
  let deleteDocument: DeleteDocumentService;

  let minioService: MinioService;
  let documentsRepository: IDocumentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDocumentService,
        FindAllDocumentsService,
        DocumentsByFilterService,
        UpdateDocumentService,
        DocumentByIdService,
        DeleteDocumentService,
        {
          provide: MinioService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue({
              Location: 'http://mockurl.com',
            }),
            renameFile: jest.fn().mockResolvedValue({
              fileUrl: 'http://mockurl.com',
            }),
            deleteFile: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: 'IDocumentsRepository',
          useValue: {
            createDocument: jest.fn().mockResolvedValue(MockIDocument),
            findAllDocuments: jest.fn().mockResolvedValue(MockDocumentsList),
            findDocumentsByFilter: jest
              .fn()
              .mockResolvedValue(MockDocumentsList),
            findDocumentById: jest.fn().mockResolvedValue(MockIDocument),
            updateDocument: jest.fn().mockResolvedValue(MockUpdatedDocument),
            deleteDocument: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    createDocument = module.get<CreateDocumentService>(CreateDocumentService);
    findAllDocuments = module.get<FindAllDocumentsService>(
      FindAllDocumentsService,
    );
    findDocumentsByFilter = module.get<DocumentsByFilterService>(
      DocumentsByFilterService,
    );
    findDocumentById = module.get<DocumentByIdService>(DocumentByIdService);
    updateDocument = module.get<UpdateDocumentService>(UpdateDocumentService);
    deleteDocument = module.get<DeleteDocumentService>(DeleteDocumentService);

    minioService = module.get<MinioService>(MinioService);
    documentsRepository = module.get<IDocumentsRepository>(
      'IDocumentsRepository',
    );
  });

  it('should be defined', () => {
    expect(createDocument).toBeDefined();
    expect(findAllDocuments).toBeDefined();
    expect(findDocumentsByFilter).toBeDefined();
    expect(findDocumentById).toBeDefined();
    expect(updateDocument).toBeDefined();
    expect(deleteDocument).toBeDefined();
    expect(minioService).toBeDefined();
  });

  describe('create document', () => {
    it('should create a document successfully', async () => {
      const result = await createDocument.execute(
        MockCreateDocumentDto,
        MockDocumentFile,
      );

      expect(minioService.uploadFile).toHaveBeenCalledTimes(1);
      expect(documentsRepository.createDocument).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIDocument);
    });

    it('should throw an error if file is missing', async () => {
      try {
        await createDocument.execute(MockCreateDocumentDto, null as any);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('file is required');
      }
    });

    it('should throw an error if totalTaxes or netValue are negative', async () => {
      const invalidAmountValue = {
        ...MockCreateDocumentDto,
        totalTaxes: -100.5,
      };

      try {
        await createDocument.execute(invalidAmountValue, MockDocumentFile);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('values cannot be negatived');
      }
    });

    it('should throw an error if document creation fails', async () => {
      jest
        .spyOn(documentsRepository, 'createDocument')
        .mockRejectedValueOnce(new Error());

      try {
        await createDocument.execute(MockCreateDocumentDto, MockDocumentFile);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('failed to create document');
      }
    });
  });

  describe('find all documents', () => {
    it('should retrieve all documents', async () => {
      const result = await findAllDocuments.execute();

      expect(documentsRepository.findAllDocuments).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockDocumentsList);
    });

    it('should throw an error if get documents fails', async () => {
      jest
        .spyOn(documentsRepository, 'findAllDocuments')
        .mockRejectedValueOnce(new AppError());

      try {
        await findAllDocuments.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });

  describe('find documents by filter', () => {
    it('should get documents by filter successfully', async () => {
      const filters = { issuer: MockIDocument.issuer };

      const result = await findDocumentsByFilter.execute(filters);

      expect(documentsRepository.findDocumentsByFilter).toHaveBeenCalledWith(
        filters,
      );
      expect(result).toEqual(MockDocumentsList);
    });

    it('should throw an error if repository fails', async () => {
      jest
        .spyOn(documentsRepository, 'findDocumentsByFilter')
        .mockRejectedValueOnce(new AppError());

      try {
        await findDocumentsByFilter.execute({ issuer: MockIDocument.issuer });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });

  describe('find document by id', () => {
    it('should retrieve document by id', async () => {
      const result = await findDocumentById.execute(MockIDocument.id);

      expect(documentsRepository.findDocumentById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIDocument);
    });

    it('should throw an error if get documents fails', async () => {
      jest
        .spyOn(documentsRepository, 'findDocumentById')
        .mockRejectedValueOnce(new AppError());

      try {
        await findDocumentById.execute(MockIDocument.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });

  describe('update document', () => {
    it('should update a document successfully', async () => {
      const result = await updateDocument.execute(
        MockIDocument.id,
        MockUpdateDocumentDto,
      );

      expect(documentsRepository.updateDocument).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockUpdatedDocument);
    });

    it('should throw an error if totalTaxes or netValue are negative', async () => {
      const invalidAmountValue = {
        ...MockUpdateDocumentDto,
        totalTaxes: -100.5,
      };

      try {
        await updateDocument.execute(MockIDocument.id, invalidAmountValue);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('values cannot be negatived');
      }
    });

    it('should throw an error if updating document fails', async () => {
      jest
        .spyOn(documentsRepository, 'updateDocument')
        .mockRejectedValueOnce(new Error());

      try {
        await updateDocument.execute(MockIDocument.id, MockUpdateDocumentDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('failed to update document');
      }
    });
  });

  describe('delete document', () => {
    it('should delete a document successfully', async () => {
      await deleteDocument.execute(MockIDocument.id);

      expect(minioService.deleteFile).toHaveBeenCalledTimes(1);
      expect(documentsRepository.deleteDocument).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if document not found', async () => {
      jest
        .spyOn(documentsRepository, 'findDocumentById')
        .mockResolvedValueOnce(null);
      try {
        await deleteDocument.execute(MockIDocument.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('invalid document id');
      }
    });

    it('should throw an error if delete document fails', async () => {
      jest
        .spyOn(documentsRepository, 'deleteDocument')
        .mockRejectedValueOnce(new Error());

      try {
        await deleteDocument.execute(MockIDocument.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('failed to delete document');
      }
    });
  });
});
