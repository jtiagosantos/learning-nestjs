import { UpdateUserPasswordInput } from '@/application/inputs/update-user-password.input';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserPasswordDTO
  implements Omit<UpdateUserPasswordInput, 'id'>
{
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  newPassword: string;
}
