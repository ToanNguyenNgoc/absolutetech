// update-job-number.dto.ts
import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsUniqueJobNumberUpdate } from '../validator/is-unique-job-number-update.decorator';

class UpdateDocumentDto {
  @IsOptional()
  @IsMongoId()
  documentId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  fileIds?: string[];
}

export class UpdateJobNumberDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsUniqueJobNumberUpdate({ message: 'Job Number code must be unique' })
  code: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsMongoId()
  @IsNotEmpty()
  assignedTo: string;

  @IsOptional()
  @IsDateString({}, { message: 'estStartDate must be an ISO date string' })
  estStartDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'estEndDate must be an ISO date string' })
  estEndDate?: string;

  @IsMongoId()
  @IsOptional()
  createdBy: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentDto)
  documents: UpdateDocumentDto[];
}
