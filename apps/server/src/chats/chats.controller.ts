import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import {
  CreateConversationMessageRequestDto,
  CreateConversationRequestDto,
  DeleteConversationMessageRequestDto,
  DeleteConversationRequestDto,
  QueryConversationConfigRequestDto,
  QueryConversationListRequestDto,
  QueryConversationMessageListRequestDto,
  UpdateConversationConfigRequestDto,
  UpdateConversationRequestDto,
} from './chats.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { ValidateBody } from '../common/decorators/validate.decorator';

@Controller('api/chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get('query-conversation')
  queryConversation(
    @Req() req: Request,
    @Query() queryConversationListDto: QueryConversationListRequestDto,
  ) {
    return this.chatsService.queryConversationList({
      ...queryConversationListDto,
      userId: (req.user as any).userId,
    });
  }

  @Post('create-conversation')
  createConversation(
    @Req() req: Request,
    @Body()
    createConversationDto: CreateConversationRequestDto,
  ) {
    return this.chatsService.createConversation({
      ...createConversationDto,
      userId: (req.user as any).userId,
    });
  }

  @Post('update-conversation')
  updateConversation(
    @Req() req: Request,
    @Body()
    updateConversationDto: UpdateConversationRequestDto,
  ) {
    return this.chatsService.updateConversation({
      ...updateConversationDto,
      userId: (req.user as any).userId,
    });
  }

  @Post('delete-conversation')
  deleteConversation(
    @Req() req: Request,
    @Body() deleteConversationDto: DeleteConversationRequestDto,
  ) {
    return this.chatsService.deleteConversation({
      ...deleteConversationDto,
      userId: (req.user as any).userId,
    });
  }

  @Get('query-conversation-message')
  queryConversationMessage(
    @Req() req: Request,
    @Query(ValidateBody)
    queryConversationMessageListDto: QueryConversationMessageListRequestDto,
  ) {
    return this.chatsService.queryConversationMessageList({
      ...queryConversationMessageListDto,
      userId: (req.user as any).userId,
    });
  }

  @Post('create-conversation-message')
  createConversationMessage(
    @Req() req: Request,
    @Body(ValidateBody)
    createConversationMessageListDto: CreateConversationMessageRequestDto,
  ) {
    return this.chatsService.createConversationMessage({
      ...createConversationMessageListDto,
      userId: (req.user as any).userId,
    });
  }

  @Post('delete-conversation-message')
  deleteConversationMessage(
    @Req() req: Request,
    @Body(ValidateBody)
    deleteConversationMessageListDto: DeleteConversationMessageRequestDto,
  ) {
    return this.chatsService.deleteConversationMessage({
      ...deleteConversationMessageListDto,
      userId: (req.user as any).userId,
    });
  }

  @Get('query-conversation-config')
  queryConversationConfig(
    @Req() req: Request,
    @Query(ValidateBody)
    queryConversationConfigRequestDto: QueryConversationConfigRequestDto,
  ) {
    return this.chatsService.queryConversationConfig({
      ...queryConversationConfigRequestDto,
      userId: (req.user as any).userId,
    });
  }

  @Post('update-conversation-config')
  updateConversationConfig(
    @Req() req: Request,
    @Body(ValidateBody)
    updateConversationConfigRequestDto: UpdateConversationConfigRequestDto,
  ) {
    return this.chatsService.updateConversationConfig({
      ...updateConversationConfigRequestDto,
      userId: (req.user as any).userId,
    });
  }
}
