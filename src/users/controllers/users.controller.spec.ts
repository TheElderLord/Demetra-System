// src/users/controllers/users.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should return status 201 and the user', async () => {
      const dto = { name: 'John', email: 'john@example.com', password: 'password' };
      const user = { id: 1, ...dto, status: false }; 
  
      jest.spyOn(usersService, 'createUser').mockResolvedValue(user as User);
  
      const result = await controller.createUser(dto);
  
      expect(result).toEqual({ statusCode: 201, user });
      expect(usersService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUserById', () => {
    it('should return status 200 and the user', async () => {
      const user = { id: 1, name: 'John', email: 'john@example.com', password: 'password' };
      jest.spyOn(usersService, 'getUserById').mockResolvedValue(user as User);

      const result = await controller.getUserById(1);

      expect(result).toEqual({ statusCode: 200, message: 'SUCCESS', user });
      expect(usersService.getUserById).toHaveBeenCalledWith(1);
    });
  });
});
