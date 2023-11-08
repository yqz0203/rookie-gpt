import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChatsService } from 'src/chats/chats.service';
import { ChatCompletionDto } from './openai.dto';
import { OpenaiService } from './openai.service';
import dayjs from 'dayjs';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseGuards(JwtAuthGuard)
@Controller('api/openai')
export class OpenaiController {
  constructor(
    private readonly configService: ConfigService,
    private readonly chatService: ChatsService,
    private readonly openaiService: OpenaiService,
  ) {}

  @Post('chatCompletion')
  @Header('Connection', 'keep-alive')
  @Header('Content-Type', 'text/event-stream')
  async chatCompletion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChatCompletionDto,
  ) {
    const userId = (req as any).user.userId;

    const conversationConfig = await this.chatService.queryConversationConfig({
      userId,
      chatConversationId: body.chatConversationId,
    });

    const conversationDetail = await this.chatService.queryConversationDetail({
      chatConversationId: body.chatConversationId,
    });

    let prompts = [];

    try {
      prompts = JSON.parse(conversationConfig.prompts);
    } catch (e) {}

    let messages: ChatCompletionRequestMessage[];

    if (conversationConfig.singleChatMode) {
      messages = [];
    } else {
      // 获取历史会话
      messages = (
        await this.chatService.queryConversationMessageList({
          userId,
          chatConversationId: body.chatConversationId,
          sort: [['id', 'DESC']],
          limit: 10,
        })
      )
        .map(message => {
          return {
            role: message.get('role'),
            content: message.get('content'),
          } as ChatCompletionRequestMessage;
        })
        .reverse();
    }

    messages = [
      ...prompts,
      ...messages,
      { role: 'user', content: body.message },
    ];

    const configuration = new Configuration({
      apiKey: this.configService.get(
        conversationConfig.model.toLocaleLowerCase().includes('gpt-4')
          ? 'OPENAI_API_KEY'
          : 'OPENAI_API_KEY3.5',
      ),
    });
    const openai = new OpenAIApi(configuration);

    let fullStr = '';

    const controller = new AbortController();
    const signal = controller.signal;

    const response = await openai.createChatCompletion(
      {
        model: conversationConfig.model,
        messages,
        temperature: conversationConfig.temperature,
        n: conversationConfig.n,
        presence_penalty: conversationConfig.presencePenalty,
        top_p: conversationConfig.topP,
        stream: true,
      },
      {
        responseType: 'stream',
        proxy: false,
        httpsAgent: this.openaiService.getHttpsProxyAgent(),
        signal,
      },
    );

    await new Promise((resolve, reject) => {
      res.on('close', () => {
        reject(new Error('请求中端'));
        controller.abort();
      });

      let tempStr = '';

      (response.data as any).on('data', data => {
        const lines = data
          .toString()
          .split('\n')
          .filter(line => line.trim() !== '');

        let str = '';

        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') {
            break; // Stream finished
          }
          if (line.startsWith('data') && tempStr) {
            try {
              const parsed = JSON.parse(tempStr);

              str += parsed.choices[0].delta.content || '';
            } catch (error) {
              console.error(
                'Could not JSON parse stream message',
                message,
                error,
              );
              controller.abort();
              reject(new HttpException('OPENAI错误，请重试', 500));
              return;
            }
            tempStr = message;
          } else {
            tempStr += message;
          }
        }

        fullStr += str;
        res.write(`${str}`);
      });

      (response.data as any).on('end', () => {
        resolve('');
        // (response.data as any).destroy();
      });

      (response.data as any).on('error', () => {
        reject(new Error('获取数据出错'));
      });
    });

    // 没有标题时，修改当前会话的标题
    if (!conversationDetail?.title.trim()) {
      await this.chatService.updateConversation({
        title: body.message.slice(0, 200),
        id: body.chatConversationId,
        userId,
        latestMessageTime: new Date(),
      });
    } else {
      // 触发修改时间
      await this.chatService.updateConversation({
        id: body.chatConversationId,
        userId,
        latestMessageTime: new Date(),
      });
    }

    await this.chatService.createConversationMessage({
      chatConversationId: body.chatConversationId,
      userId: (req as any).user.userId,
      content: body.message,
      role: 'user',
    });

    await this.chatService.createConversationMessage({
      chatConversationId: body.chatConversationId,
      userId,
      content: fullStr,
      role: 'assistant',
    });

    res.end();
  }

  @Get('finance-info')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600000) // 10min
  @CacheKey('finance-info')
  queryFinanceInfo() {
    return this.openaiService.queryFinanceInfo({
      startDate: dayjs().set('date', 1).format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    });
  }
}
