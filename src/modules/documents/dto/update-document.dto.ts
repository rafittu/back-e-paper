import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { DocumentOriginEnum, DocumentTypeEnum } from '../../../database/schema';
import { Type } from 'class-transformer';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsOptional()
  @IsString()
  documentName?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsEnum(DocumentOriginEnum)
  documentOrigin?: DocumentOriginEnum;

  @IsOptional()
  @IsEnum(DocumentTypeEnum)
  documentType?: DocumentTypeEnum;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  totalTaxes?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  netValue?: number;
}
