import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { Customer } from "./customer.entity";
import { BullModule } from "@nestjs/bullmq";
import { CustomersProcessor } from "./customers.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    BullModule.registerQueue({ name: "customers" }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersProcessor],
})
export class CustomersModule {}
