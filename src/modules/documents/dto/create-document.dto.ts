import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { DocumentOriginEnum, DocumentTypeEnum } from '../../../database/schema';
import { Type } from 'class-transformer';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  documentName: string;

  @IsNotEmpty()
  @IsString()
  issuer: string;

  @IsNotEmpty()
  @IsEnum(DocumentOriginEnum)
  documentOrigin: DocumentOriginEnum;

  @IsNotEmpty()
  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  totalTaxes: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  netValue: number;
}
