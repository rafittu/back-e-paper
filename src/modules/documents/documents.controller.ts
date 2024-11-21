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

@Controller('documents')
export class DocumentsController {
  constructor(private readonly createDocumentService: CreateDocumentService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.createDocumentService.execute(createDocumentDto, file);
  }
}
