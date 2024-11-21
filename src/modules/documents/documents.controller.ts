import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateDocumentService } from './services/create_document.service';
import { IDocument } from './interfaces/documents.interface';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly createDocumentService: CreateDocumentService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IDocument> {
    return this.createDocumentService.execute(createDocumentDto, file);
  }
}
