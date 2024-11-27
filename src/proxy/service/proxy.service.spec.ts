// src/proxy/proxy.service.spec.ts

import { ProxyService } from './proxy.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');

describe('ProxyService', () => {
  let service: ProxyService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProxyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'PROXY_HOST':
                  return '45.196.48.9';
                case 'PROXY_PORT':
                  return 5435;
                case 'PROXY_USERNAME':
                  return 'jtzhwqur';
                case 'PROXY_PASSWORD':
                  return 'jnf0t0n2tecg';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
