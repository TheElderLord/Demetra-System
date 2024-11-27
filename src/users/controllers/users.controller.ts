import { Controller, Post, Body, Get, Query, Inject, Param, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager'; // Updated import
import { Cache } from 'cache-manager';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getUsers();
    return { statusCode: 200, users };
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    return { statusCode: 201, user };
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async getUserById(@Param("id") id: number) {
    const user = await this.usersService.getUserById(+id);
    return { statusCode: 200, message: 'SUCCESS', user };
  }
  
}
