import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks.status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus, { each: true })
  status?: TaskStatus[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}
