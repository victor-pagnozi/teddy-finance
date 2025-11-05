import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const entity = this.customersRepository.create({
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      salary: dto.salary ?? 0,
      company: dto.company ?? 0,
    });
    return this.customersRepository.save(entity);
  }

  async findAllPaginated(
    page = 1,
    pageSize = 16
  ): Promise<{
    items: Customer[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const [items, total] = await this.customersRepository.findAndCount({
      order: { createdAt: "DESC" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  async findOne(id: string): Promise<Customer> {
    const entity = await this.customersRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException("Customer not found");
    return entity;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.customersRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customersRepository.delete(id);
    if (!result.affected) throw new NotFoundException("Customer not found");
  }
}
