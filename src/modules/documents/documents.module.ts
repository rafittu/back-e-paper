import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { MinioService } from '../../common/aws/minio.service';
import { DocumentsRepository } from './repository/document.repository';
import { CreateDocumentService } from './services/create_document.service';

@Module({
  controllers: [DocumentsController],
  providers: [
    MinioService,
    {
      provide: 'IDocumentsRepository',
      useClass: DocumentsRepository,
    },
    CreateDocumentService,
  ],
})
export class DocumentsModule {}
