import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateDocumentService } from './services/create_document.service';
import { IDocument } from './interfaces/documents.interface';
import { FindAllDocumentsService } from './services/find_all_documents.service';
import { FilterDocumentsDto } from './dto/filter-documents.dto';
import { DocumentsByFilterService } from './services/documents-by-filter.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly createDocument: CreateDocumentService,
    private readonly findAllDocuments: FindAllDocumentsService,
    private readonly documentsByFilter: DocumentsByFilterService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IDocument> {
    return this.createDocument.execute(createDocumentDto, file);
  }

  @Get('/all')
  async findAll(): Promise<IDocument[]> {
    return this.findAllDocuments.execute();
  }

  @Get('/search')
  async findByFilters(
    @Query() filters: FilterDocumentsDto,
  ): Promise<IDocument[]> {
    return this.documentsByFilter.execute(filters);
  }
}
