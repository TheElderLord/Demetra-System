// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager'; 
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersProcessor } from './processors/users.processors';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: 'user-status',
    }),
    CacheModule.register(),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersProcessor],
})
export class UsersModule {}
