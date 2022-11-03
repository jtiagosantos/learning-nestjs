import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOneBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  barCode: string;
}
