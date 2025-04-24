import { GetUserInput } from '@/application/inputs/get-user.input';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordParams implements GetUserInput {
  @IsString()
  @IsNotEmpty()
  id: string;
}
