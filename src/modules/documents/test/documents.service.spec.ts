import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentService } from '../services/create_document.service';
import { MinioService } from '../../../common/aws/minio.service';
import { IDocumentsRepository } from '../interfaces/repository.interface';
import {
  MockCreateDocument,
  MockDocumentFile,
  MockIDocument,
} from './mocks/documents.mock';

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
  });
});
