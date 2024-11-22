import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { MinioService } from '../../common/aws/minio.service';
import { DocumentsRepository } from './repository/document.repository';
import { CreateDocumentService } from './services/create-document.service';
import { FindAllDocumentsService } from './services/find-all-documents.service';
import { DocumentsByFilterService } from './services/documents-by-filter.service';
import { UpdateDocumentService } from './services/update-document.service';
import { DocumentByIdService } from './services/document-by-id.service';
import { DeleteDocumentService } from './services/delete-document.service';

@Module({
  controllers: [DocumentsController],
  providers: [
    MinioService,
    {
      provide: 'IDocumentsRepository',
      useClass: DocumentsRepository,
    },
    CreateDocumentService,
    FindAllDocumentsService,
    DocumentsByFilterService,
    DocumentByIdService,
    UpdateDocumentService,
    DeleteDocumentService,
  ],
})
export class DocumentsModule {}
