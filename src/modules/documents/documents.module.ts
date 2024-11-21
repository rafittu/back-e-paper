import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MinioService } from '../../common/aws/minio.service';
import { DocumentsRepository } from './repository/document.repository';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsRepository, MinioService, DocumentsService],
})
export class DocumentsModule {}
