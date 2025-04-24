import { GetUserInput } from '@/application/inputs/get-user.input';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserParams implements GetUserInput {
  @IsString()
  @IsNotEmpty()
  id: string;
}
