import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
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
  assignedTo: string;

  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentDto)
  documents: CreateDocumentDto[];
}
