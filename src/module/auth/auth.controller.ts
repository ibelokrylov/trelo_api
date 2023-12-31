import { MainResponseType } from '@/src/common/types/main-response.type';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { sessionConst } from './const/session.const';
import { AuthenticatedDto } from './dto/authenticated.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/authentication')
  async authenticated(
    @Body() dto: AuthenticatedDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<MainResponseType> {
    const jwt = await this.authService.authenticatedUser(dto);
    response.setCookie(sessionConst.session_name_cookie, jwt, {
      path: '/',
      signed: true,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User authenticated',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<MainResponseType> {
    res.setCookie(sessionConst.session_name_cookie, '');
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged out',
    };
  }
}
