import { IsNotEmpty, IsString, IsEnum, IsNumber, Min } from 'class-validator';
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
  @Min(0)
  @IsNumber()
  totalTaxes: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  @IsNumber()
  netValue: number;
}
