import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../documents.controller';
import { CreateDocumentService } from '../services/create_document.service';
import {
  MockCreateDocumentDto,
  MockDocumentFile,
  MockIDocument,
} from './mocks/documents.mock';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let createDocument: CreateDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: CreateDocumentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIDocument),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    createDocument = module.get<CreateDocumentService>(CreateDocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create document', () => {
    it('should create new document successfully', async () => {
      const result = await controller.create(
        MockCreateDocumentDto,
        MockDocumentFile,
      );

      expect(createDocument.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIDocument);
    });
  });
});
