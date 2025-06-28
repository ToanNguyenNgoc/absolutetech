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
  client: string;

  @IsString()
  @IsNotEmpty()
  location_at: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsMongoId()
  @IsNotEmpty()
  assigned_to: string;

  @IsOptional()
  @IsDateString({}, { message: 'est_start_date must be an ISO date string' })
  est_start_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'est_end_date must be an ISO date string' })
  est_end_date?: string;

  @IsMongoId()
  @IsOptional()
  created_by: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentDto)
  documents: UpdateDocumentDto[];
}
