import { RegisterUserInput } from '@/application/inputs/register-user.input';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterUserDTO implements RegisterUserInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}
