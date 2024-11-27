import { Injectable, BadRequestException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Import InjectQueue from @nestjs/bull
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager'; 
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectQueue('user-status') private readonly userQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Ensure Queue type is correct
  ) {}


  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('ERR_USER_EMAIL_EXISTS');
    }

    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);

  
    await this.userQueue.add(
      'update-status',
      { userId: user.id },
      { delay: 10000 },
    );

    return user;
  }

  async getUserById(id: number): Promise<User> {
    const cacheKey = `user:${id}`;
    let cachedUser: User = await this.cacheManager.get(cacheKey);
    this.logger.log(`Found cachedUser for ID ${id}: ${JSON.stringify(cachedUser)}`);
    if (cachedUser) {
      this.logger.log(`Found cachedUser for ID ${id}: ${JSON.stringify(cachedUser)}`);
      return cachedUser;
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('ERR_USER_NOT_FOUND');
    }
    await this.cacheManager.set(cacheKey, user, 1800);
    return user;
  }


  async getUsers(): Promise<User[]>{
    const users = await this.userRepository.find();
    return users;
  }
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
