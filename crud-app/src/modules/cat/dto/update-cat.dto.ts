import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateCatDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  breed: string;
}
