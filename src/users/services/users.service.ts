import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Import InjectQueue from @nestjs/bull
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectQueue('user-status') private readonly userQueue: Queue, // Ensure Queue type is correct
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

    // Add a job to update status after 10 seconds
    await this.userQueue.add(
      'update-status',
      { userId: user.id },
      { delay: 10000 },
    );

    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('ERR_USER_NOT_FOUND');
    }
    return user;
  }
  async getUsers(): Promise<User[]>{
    const users = await this.userRepository.find();
    return users;
  }
}
