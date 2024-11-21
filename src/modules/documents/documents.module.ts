import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MinioService } from '../../common/aws/minio.service';

@Module({
  controllers: [DocumentsController],
  providers: [MinioService, DocumentsService],
})
export class DocumentsModule {}
