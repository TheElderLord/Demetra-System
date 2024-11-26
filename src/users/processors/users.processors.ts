import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Processor('user-status')
export class UsersProcessor {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Process('update-status')
  async handleUpdateStatus(job: Job<{ userId: number }>) {
    const user = await this.userRepository.findOne({
      where: { id: job.data.userId },
    });
    if (user) {
      user.status = true;
      await this.userRepository.save(user);
    }
  }
}
