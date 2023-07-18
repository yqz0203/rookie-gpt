import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { QueryFianceInfoDto } from './openai.dto';

@Injectable()
export class OpenaiService {
  constructor(private readonly configService: ConfigService) {}

  getHttpsProxyAgent(): HttpsProxyAgent | undefined {
    return this.configService.get('PROXY_PORT')
      ? new HttpsProxyAgent(
          `http://127.0.0.1:${this.configService.get('PROXY_PORT')}`,
        )
      : undefined;
  }

  private makeOpenaiRequest(config: AxiosRequestConfig) {
    return axios({
      baseURL: 'https://api.openai.com',
      httpsAgent: this.getHttpsProxyAgent(),
      headers: {
        Authorization: `Bearer ${this.configService.get('OPENAI_API_KEY')}`,
      },
      ...config,
    });
  }

  async queryFinanceInfo(params: QueryFianceInfoDto) {
    const {
      data: { hard_limit_usd },
    } = await this.makeOpenaiRequest({
      method: 'get',
      url: '/v1/dashboard/billing/subscription',
    });

    const {
      data: { total_usage },
    } = await this.makeOpenaiRequest({
      method: 'get',
      url: '/v1/dashboard/billing/usage',
      params: { start_date: params.startDate, end_date: params.endDate },
    });

    return { limit: hard_limit_usd, usage: total_usage };
  }
}
