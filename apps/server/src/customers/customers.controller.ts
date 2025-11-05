import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { Customer } from "./customer.entity";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new customer" })
  @ApiResponse({ status: 201, description: "Customer created successfully" })
  @ApiBody({ type: CreateCustomerDto, description: "Customer data" })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all customers" })
  @ApiResponse({ status: 200, description: "Customers fetched successfully" })
  @ApiOkResponse({
    type: Customer,
    isArray: true,
    description: "Customers fetched successfully",
  })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a customer by ID" })
  @ApiResponse({ status: 200, description: "Customer fetched successfully" })
  @ApiOkResponse({
    type: Customer,
    description: "Customer fetched successfully",
  })
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a customer by ID" })
  @ApiResponse({ status: 200, description: "Customer updated successfully" })
  @ApiOkResponse({
    type: Customer,
    description: "Customer updated successfully",
  })
  update(@Param("id") id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a customer by ID" })
  @ApiResponse({ status: 200, description: "Customer deleted successfully" })
  @ApiOkResponse({ description: "Customer deleted successfully" })
  remove(@Param("id") id: string) {
    return this.customersService.remove(id);
  }
}
