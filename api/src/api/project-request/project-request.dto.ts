import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common';
import { ProjectRequestModel } from 'src/models';

export class ProjectRequestQr extends BaseQuery {}
// import { IssueModel } from 'src/models';

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
  @IsNotEmpty()
  spare: string;

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
  @IsNotEmpty()
  job_number: string;

  @ApiProperty()
  @IsOptional()
  date_request: Date;

  @ApiProperty({ default: ProjectRequestModel.PJ_STATUS_NEW })
  @IsOptional()
  status: string;

  // @ApiProperty({
  //   type: [IssueItemCreate],
  // })
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => IssueItemCreate)
  // issues: IssueItemCreate[];
}
