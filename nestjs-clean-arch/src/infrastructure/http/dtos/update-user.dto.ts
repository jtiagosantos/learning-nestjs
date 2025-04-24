import { UpdateUserInput } from '@/application/inputs/update-user.input';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserDTO implements Omit<UpdateUserInput, 'id'> {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
