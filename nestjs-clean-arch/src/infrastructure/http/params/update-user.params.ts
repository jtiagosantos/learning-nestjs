import { GetUserInput } from '@/application/inputs/get-user.input';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserParams implements GetUserInput {
  @IsString()
  @IsNotEmpty()
  id: string;
}
