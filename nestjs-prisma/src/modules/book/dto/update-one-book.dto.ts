import { IsOptional, IsString } from 'class-validator';

export class UpdateOneBookDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  barCode: string;
}
