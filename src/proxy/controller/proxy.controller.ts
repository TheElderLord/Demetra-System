// src/proxy/proxy.controller.ts

import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ProxyService } from '../service/proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async getThroughProxy(@Query('url') url: string) {
    if (!url) {
      return { statusCode: 400, message: 'URL query parameter is required' };
    }

    try {
      const data = await this.proxyService.fetchWithProxy(url);
      return { statusCode: 200, data };
    } catch (error) {
      return { statusCode: 500, message: error.message };
    }
  }

  @Post()
  async postThroughProxy(@Body() body: { url: string; data: any }) {
    if (!body.url) {
      return { statusCode: 400, message: 'URL is required in the request body' };
    }

    try {
      const response = await this.proxyService.postWithProxy(body.url, body.data);
      return { statusCode: 200, data: response };
    } catch (error) {
      return { statusCode: 500, message: error.message };
    }
  }
}
