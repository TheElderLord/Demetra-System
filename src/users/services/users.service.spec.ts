/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let userQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getQueueToken('user-status'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userQueue = module.get<Queue>(getQueueToken('user-status'));
  });

  it('should throw error if email exists', async () => {
    const dto = {
      name: 'Test',
      email: 'test@example.com',
      password: 'password',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User());

    await expect(service.createUser(dto)).rejects.toThrow(
      'ERR_USER_EMAIL_EXISTS',
    );
  });
});
