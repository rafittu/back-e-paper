import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentService } from '../services/create_document.service';
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
import { FindAllDocumentsService } from '../services/find_all_documents.service';
import { UpdateDocumentService } from '../services/update-document.service';
import { FindDocumentByIdService } from '../services/document-by-id.service';

describe('DocumentsService', () => {
  let createDocument: CreateDocumentService;
  let findAllDocuments: FindAllDocumentsService;
  let findDocumentById: FindDocumentByIdService;
  let updateDocument: UpdateDocumentService;

  let minioService: MinioService;
  let documentsRepository: IDocumentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDocumentService,
        FindAllDocumentsService,
        UpdateDocumentService,
        FindDocumentByIdService,
        {
          provide: MinioService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue({
              Location: 'http://mockurl.com',
            }),
            renameFile: jest.fn().mockResolvedValue({
              fileUrl: 'http://mockurl.com',
            }),
          },
        },
        {
          provide: 'IDocumentsRepository',
          useValue: {
            createDocument: jest.fn().mockResolvedValue(MockIDocument),
            findAllDocuments: jest.fn().mockResolvedValue(MockDocumentsList),
            updateDocument: jest.fn().mockResolvedValue(MockUpdatedDocument),
            findDocumentById: jest.fn().mockResolvedValue(MockIDocument),
          },
        },
      ],
    }).compile();

    createDocument = module.get<CreateDocumentService>(CreateDocumentService);
    findAllDocuments = module.get<FindAllDocumentsService>(
      FindAllDocumentsService,
    );
    findDocumentById = module.get<FindDocumentByIdService>(
      FindDocumentByIdService,
    );
    updateDocument = module.get<UpdateDocumentService>(UpdateDocumentService);

    minioService = module.get<MinioService>(MinioService);
    documentsRepository = module.get<IDocumentsRepository>(
      'IDocumentsRepository',
    );
  });

  it('should be defined', () => {
    expect(createDocument).toBeDefined();
    expect(findAllDocuments).toBeDefined();
    expect(findDocumentById).toBeDefined();
    expect(updateDocument).toBeDefined();
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

  describe('find all documents', () => {
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
});
