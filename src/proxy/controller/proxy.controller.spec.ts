// src/proxy/proxy.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ProxyController } from './proxy.controller';
import { ProxyService } from '../service/proxy.service';

describe('ProxyController', () => {
  let controller: ProxyController;
  let proxyService: ProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProxyController],
      providers: [
        {
          provide: ProxyService,
          useValue: {
            fetchWithProxy: jest.fn(),
            postWithProxy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProxyController>(ProxyController);
    proxyService = module.get<ProxyService>(ProxyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
