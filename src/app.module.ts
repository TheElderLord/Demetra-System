import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './users/users.module';
import { cacheManagerStore } from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'user-status',
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: cacheManagerStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: 1800, // Default cache TTL (30 minutes)
      }),
    }),
    UsersModule,
  ],
})
export class AppModule {}
