import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RegisterUserDTO } from '../dtos/register-user.dto';
import { RegisterUserUseCase } from '@/application/use-cases/register-user.use-case';
import { SignInUserUseCase } from '@/application/use-cases/signin-user.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { UpdateUserPasswordUseCase } from '@/application/use-cases/update-user-password.use-case';
import { DeleteUserUseCase } from '@/application/use-cases/delete-user.use-case';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '@/application/use-cases/list-users.use-case';
import { SignInUserDTO } from '../dtos/signin-user.dto';
import { ListUsersDTO } from '../dtos/list-users.dto';
import { GetUserParams } from '../params/get-user.params';
import { UpdateUserParams } from '../params/update-user.params';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { UpdateUserPasswordParams } from '../params/update-user-password.params';
import { UpdateUserPasswordDTO } from '../dtos/update-user-password.dto';
import { DeleteUserParams } from '../params/delete-user.params';

@Controller('users')
export class UsersController {
  @Inject(RegisterUserUseCase)
  private readonly registerUserUseCase: RegisterUserUseCase;

  @Inject(SignInUserUseCase)
  private readonly signInUserUseCase: SignInUserUseCase;

  @Inject(ListUsersUseCase)
  private readonly listUsersUseCase: ListUsersUseCase;

  @Inject(GetUserUseCase)
  private readonly getUserUseCase: GetUserUseCase;

  @Inject(UpdateUserUseCase)
  private readonly updateUserUseCase: UpdateUserUseCase;

  @Inject(UpdateUserPasswordUseCase)
  private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase;

  @Inject(DeleteUserUseCase)
  private readonly deleteUserUseCase: DeleteUserUseCase;

  @Post('/register')
  async register(@Body() body: RegisterUserDTO) {
    return this.registerUserUseCase.execute(body);
  }

  @HttpCode(200)
  @Post('/signin')
  async signin(@Body() body: SignInUserDTO) {
    return this.signInUserUseCase.execute(body);
  }

  @Get()
  async search(@Query() query: ListUsersDTO) {
    return this.listUsersUseCase.execute(query);
  }

  @Get(':id')
  async getUser(@Param() params: GetUserParams) {
    return this.getUserUseCase.execute(params);
  }

  @Put(':id')
  async updateUser(
    @Param() params: UpdateUserParams,
    @Body() body: UpdateUserDTO,
  ) {
    return this.updateUserUseCase.execute({ ...params, ...body });
  }

  @Patch(':id')
  async updateUserPassword(
    @Param() params: UpdateUserPasswordParams,
    @Body() body: UpdateUserPasswordDTO,
  ) {
    return this.updateUserPasswordUseCase.execute({ ...params, ...body });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() params: DeleteUserParams) {
    return this.deleteUserUseCase.execute(params);
  }
}
