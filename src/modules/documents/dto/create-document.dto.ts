import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { DocumentOriginEnum, DocumentTypeEnum } from '../../../database/schema';

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
  @IsNumber()
  totalTaxes: number;

  @IsNotEmpty()
  @IsNumber()
  netValue: number;
}
