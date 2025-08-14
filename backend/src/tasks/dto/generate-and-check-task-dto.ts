/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

type TaskData = {
  title: string;
  description: string;
};

export class GenerateAndCheckTaskDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
  allTasks: TaskData[];
}
