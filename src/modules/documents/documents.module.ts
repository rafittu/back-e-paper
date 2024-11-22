import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { MinioService } from '../../common/aws/minio.service';
import { DocumentsRepository } from './repository/document.repository';
import { CreateDocumentService } from './services/create-document.service';
import { FindAllDocumentsService } from './services/find-all-documents.service';
import { DocumentsByFilterService } from './services/documents-by-filter.service';

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
  ],
})
export class DocumentsModule {}
