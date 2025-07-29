/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';
import { ProjectRequestModel } from 'src/models';

export class ProjectRequestQr extends BaseQuery { }

export class IssueCreate {
  @ApiProperty()
  @IsNumber()
  quantity_request: number;

  @ApiProperty()
  @IsNotEmpty()
  project_request: string;

  @ApiProperty()
  @IsNotEmpty()
  bin_configure: string;

  @ApiProperty()
  bin: string;

  @ApiProperty()
  @IsOptional()
  issue_to: string;

  @ApiProperty()
  returned: string;
}

export class ProjectRequestCreate {
  @ApiProperty()
  @IsOptional()
  client: string;

  @ApiProperty()
  @IsOptional()
  project_name: string;

  @ApiProperty()
  job_number: string;

  @ApiProperty()
  @IsOptional()
  date_request: Date;

  @ApiProperty({ default: ProjectRequestModel.PJ_STATUS_NEW })
  @IsOptional()
  @IsIn([ProjectRequestModel.PJ_STATUS_IN_PROGRESS, ProjectRequestModel.PJ_STATUS_ISSUE])
  status: string;

}
