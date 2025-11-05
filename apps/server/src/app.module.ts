import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersModule } from "./customers/customers.module";
import { CacheModule } from "@nestjs/cache-manager";
import { BullModule } from "@nestjs/bullmq";
import { redisStore } from "cache-manager-redis-yet";
import { MetricsModule } from "./metrics/metrics.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          url: config.get<string>("REDIS_URL") || undefined,
          ttl: 30000,
          socket: config.get<string>("REDIS_HOST")
            ? {
                host: config.get<string>("REDIS_HOST", "localhost"),
                port: Number(config.get<string>("REDIS_PORT", "6379")),
              }
            : undefined,
        }),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>("DATABASE_URL");

        return {
          type: "postgres" as const,
          url: dbUrl,
          host: dbUrl ? undefined : config.get<string>("DB_HOST", "localhost"),
          port: dbUrl
            ? undefined
            : Number(config.get<string>("DB_PORT", "5432")),
          username: dbUrl
            ? undefined
            : config.get<string>("DB_USER", "postgres"),
          password: dbUrl
            ? undefined
            : config.get<string>("DB_PASSWORD", "postgres"),
          database: dbUrl ? undefined : config.get<string>("DB_NAME", "teddy"),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>("REDIS_HOST", "localhost"),
          port: Number(config.get<string>("REDIS_PORT", "6379")),
          username: config.get<string>("REDIS_USER") || undefined,
          password: config.get<string>("REDIS_PASSWORD") || undefined,
        },
      }),
    }),

    CustomersModule,
    MetricsModule,
  ],
})
export class AppModule {}
