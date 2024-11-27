// src/proxy/proxy.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxyService {
  constructor(private readonly configService: ConfigService) {}

  async fetchWithProxy(url: string, options?: AxiosRequestConfig): Promise<any> {
    const proxyHost = this.configService.get<string>('PROXY_HOST');
    const proxyPort = this.configService.get<number>('PROXY_PORT');
    const proxyUsername = this.configService.get<string>('PROXY_USERNAME');
    const proxyPassword = this.configService.get<string>('PROXY_PASSWORD');

    const proxyConfig = {
      host: proxyHost,
      port: proxyPort,
      auth: {
        username: proxyUsername,
        password: proxyPassword,
      },
    };

    const axiosConfig: AxiosRequestConfig = {
      ...options,
      proxy: proxyConfig,
    };

    const response = await axios.get(url, axiosConfig);
    return response.data;
  }
}
