import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersModule } from "./customers/customers.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

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
    CustomersModule,
  ],
})
export class AppModule {}
