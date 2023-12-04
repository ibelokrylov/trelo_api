/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import configuration from './config/configuration';
import { typeormFactory } from './config/factory/typeorm.factory';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ListModule } from './module/list/list.module';
import { CardModule } from './module/card/card.module';
import { BoardModule } from './module/board/board.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeormFactory,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ListModule,
    CardModule,
    BoardModule,
  ],
  providers: [Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
