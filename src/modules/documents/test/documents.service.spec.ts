import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentService } from '../services/create_document.service';
import { MinioService } from '../../../common/aws/minio.service';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import {
  MockCreateDocument,
  MockDocumentFile,
  MockIDocument,
} from './mocks/documents.mock';
import { AppError } from '../../../common/errors/Error';

describe('DocumentsService', () => {
  let createDocumentService: CreateDocumentService;
  let minioService: MinioService;
  let documentsRepository: IDocumentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateDocumentService,
        {
          provide: MinioService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue({
              Location: 'http://mockurl.com',
            }),
          },
        },
        {
          provide: 'IDocumentsRepository',
          useValue: {
            createDocument: jest.fn().mockResolvedValue(MockIDocument),
          },
        },
      ],
    }).compile();

    createDocumentService = module.get<CreateDocumentService>(
      CreateDocumentService,
    );
    minioService = module.get<MinioService>(MinioService);
    documentsRepository = module.get<IDocumentsRepository>(
      'IDocumentsRepository',
    );
  });

  it('should be defined', () => {
    expect(createDocumentService).toBeDefined();
    expect(minioService).toBeDefined();
  });

  describe('create document service', () => {
    it('should create a document successfully', async () => {
      const result = await createDocumentService.execute(
        MockCreateDocument,
        MockDocumentFile,
      );

      expect(minioService.uploadFile).toHaveBeenCalledTimes(1);
      expect(documentsRepository.createDocument).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIDocument);
    });

    it('should throw an error if file is missing', async () => {
      try {
        await createDocumentService.execute(MockCreateDocument, null as any);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('file is required');
      }
    });

    it('should throw an error if totalTaxes or netValue are negative', async () => {
      const invalidAmountValue = {
        ...MockCreateDocument,
        totalTaxes: -100.5,
      };

      try {
        await createDocumentService.execute(
          invalidAmountValue,
          MockDocumentFile,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('values cannot be negatived');
      }
    });
  });
});
