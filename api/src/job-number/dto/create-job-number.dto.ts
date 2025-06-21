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
import { IsUniqueJobNumber } from '../validator/is-unique-job-number.decorator';

class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., "Line #2", "Checklist"

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  fileIds?: string[]; // FileUpload IDs uploaded earlier
}

export class CreateJobNumberDto {
  @IsString()
  @IsNotEmpty()
  @IsUniqueJobNumber({ message: 'Job Number code must be unique' })
  code: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsMongoId()
  @IsNotEmpty()
  assigned_to: string;

  @IsMongoId()
  @IsOptional()
  created_by: string;

  @IsOptional()
  @IsDateString({}, { message: 'est_start_date must be an ISO date string' })
  est_start_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'est_end_date must be an ISO date string' })
  est_end_date?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentDto)
  documents: CreateDocumentDto[];
}
