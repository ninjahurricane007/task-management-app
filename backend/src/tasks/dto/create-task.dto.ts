import { IsNotEmpty } from 'class-validator'; //to implement pipes for validation

export class CreateTaskDto {
  @IsNotEmpty() //will not allow the request is title is not given
  title: string;

  @IsNotEmpty()
  description: string;
}
