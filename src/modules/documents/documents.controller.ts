import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CreateDocumentService } from './services/create-document.service';
import { IDocument } from './interfaces/documents.interface';
import { FindAllDocumentsService } from './services/find-all-documents.service';
import { FilterDocumentsDto } from './dto/filter-documents.dto';
import { DocumentsByFilterService } from './services/documents-by-filter.service';
import { DocumentByIdService } from './services/document-by-id.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateDocumentService } from './services/update-document.service';
import { DeleteDocumentService } from './services/delete-document.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly createDocument: CreateDocumentService,
    private readonly findAllDocuments: FindAllDocumentsService,
    private readonly documentsByFilter: DocumentsByFilterService,
    private readonly documentById: DocumentByIdService,
    private readonly updateDocument: UpdateDocumentService,
    private readonly deleteDocument: DeleteDocumentService,
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

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<IDocument> {
    return this.documentById.execute(id);
  }

  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<IDocument> {
    return this.updateDocument.execute(id, updateDocumentDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteDocument.execute(id);
    return { message: `document with id ${id} successfully deleted` };
  }
}
