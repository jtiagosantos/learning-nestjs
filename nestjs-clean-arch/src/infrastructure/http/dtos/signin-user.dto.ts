import { SignInUserInput } from '@/application/inputs/signin-user.input';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDTO implements SignInUserInput {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
