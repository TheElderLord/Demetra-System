// src/proxy/proxy.module.ts

import { Module } from '@nestjs/common';
import { ProxyService } from './service/proxy.service';
import { ProxyController } from './controller/proxy.controller';

@Module({
  providers: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
