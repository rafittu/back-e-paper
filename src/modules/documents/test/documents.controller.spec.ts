import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../documents.controller';
import { CreateDocumentService } from '../services/create_document.service';
import {
  MockCreateDocumentDto,
  MockDocumentFile,
  MockDocumentsList,
  MockIDocument,
  MockUpdatedDocument,
  MockUpdateDocumentDto,
} from './mocks/documents.mock';
import { FindAllDocumentsService } from '../services/find_all_documents.service';
import { UpdateDocumentService } from '../services/update-document.service';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let createDocument: CreateDocumentService;
  let findAllDocuments: FindAllDocumentsService;
  let updateDocument: UpdateDocumentService;

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
        {
          provide: FindAllDocumentsService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockDocumentsList),
          },
        },
        {
          provide: UpdateDocumentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockUpdatedDocument),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    createDocument = module.get<CreateDocumentService>(CreateDocumentService);
    findAllDocuments = module.get<FindAllDocumentsService>(
      FindAllDocumentsService,
    );
    updateDocument = module.get<UpdateDocumentService>(UpdateDocumentService);
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

  describe('find all documents', () => {
    it('should list all documents successfully', async () => {
      const result = await controller.findAll();

      expect(findAllDocuments.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockDocumentsList);
    });
  });

  describe('update document', () => {
    it('should update document successfully', async () => {
      const result = await controller.update(
        MockIDocument.id,
        MockUpdateDocumentDto,
      );

      expect(updateDocument.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockUpdatedDocument);
    });
  });
});
