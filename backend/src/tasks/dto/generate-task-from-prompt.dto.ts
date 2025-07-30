/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTaskFromPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
