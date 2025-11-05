import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { ListCustomersDto } from "./dto/list-customers.dto";
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
  @ApiOperation({ summary: "Get customers (paginated)" })
  findAll(@Query() query: ListCustomersDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 16;
    return this.customersService.findAllPaginated(page, pageSize);
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
