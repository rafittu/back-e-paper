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
import { FindDocumentByIdService } from '../services/document-by-id.service';
import { DeleteDocumentService } from '../services/delete-document.service';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let createDocument: CreateDocumentService;
  let findAllDocuments: FindAllDocumentsService;
  let findDocumentById: FindDocumentByIdService;
  let updateDocument: UpdateDocumentService;
  let deleteDocument: DeleteDocumentService;

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
          provide: FindDocumentByIdService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIDocument),
          },
        },
        {
          provide: UpdateDocumentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockUpdatedDocument),
          },
        },
        {
          provide: DeleteDocumentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    createDocument = module.get<CreateDocumentService>(CreateDocumentService);
    findAllDocuments = module.get<FindAllDocumentsService>(
      FindAllDocumentsService,
    );
    findDocumentById = module.get<FindDocumentByIdService>(
      FindDocumentByIdService,
    );
    updateDocument = module.get<UpdateDocumentService>(UpdateDocumentService);
    deleteDocument = module.get<DeleteDocumentService>(DeleteDocumentService);
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

  describe('find document by id', () => {
    it('should get document successfully', async () => {
      const result = await controller.findById(MockIDocument.id);

      expect(findDocumentById.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(MockIDocument);
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

  describe('delete document', () => {
    it('should delete document successfully', async () => {
      const result = await controller.delete(MockIDocument.id);

      expect(deleteDocument.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        message: `document with id ${MockIDocument.id} successfully deleted`,
      });
    });
  });
});
