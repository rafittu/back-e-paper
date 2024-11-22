import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { MinioService } from '../../common/aws/minio.service';
import { DocumentsRepository } from './repository/document.repository';
import { CreateDocumentService } from './services/create_document.service';
import { FindAllDocumentsService } from './services/find_all_documents.service';
import { UpdateDocumentService } from './services/update-document.service';

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
    UpdateDocumentService,
  ],
})
export class DocumentsModule {}
