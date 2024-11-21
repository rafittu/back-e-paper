import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { DocumentOriginEnum, DocumentTypeEnum } from '../../../database/schema';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  document_name: string;

  @IsNotEmpty()
  @IsString()
  issuer: string;

  @IsNotEmpty()
  @IsEnum(DocumentOriginEnum)
  document_origin: DocumentOriginEnum;

  @IsNotEmpty()
  @IsEnum(DocumentTypeEnum)
  document_type: DocumentTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  total_taxes: number;

  @IsNotEmpty()
  @IsNumber()
  net_value: number;
}
