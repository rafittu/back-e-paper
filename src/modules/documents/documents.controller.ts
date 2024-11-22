import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateDocumentService } from './services/create_document.service';
import { IDocument } from './interfaces/documents.interface';
import { FindAllDocumentsService } from './services/find_all_documents.service';
import { FindDocumentByIdService } from './services/document-by-id.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateDocumentService } from './services/update-document.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly createDocument: CreateDocumentService,
    private readonly findAllDocuments: FindAllDocumentsService,
    private readonly findDocumentById: FindDocumentByIdService,
    private readonly updateDocument: UpdateDocumentService,
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

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<IDocument> {
    return this.findDocumentById.execute(id);
  }

  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<IDocument> {
    return this.updateDocument.execute(id, updateDocumentDto);
  }
}
