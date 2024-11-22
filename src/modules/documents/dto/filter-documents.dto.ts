import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { DocumentOriginEnum, DocumentTypeEnum } from '../../../database/schema';
import { Type } from 'class-transformer';

export class FilterDocumentsDto {
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
  @IsNumber()
  totalTaxes?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  netValue?: number;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}
