import { Module } from '@nestjs/common';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [DocumentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
