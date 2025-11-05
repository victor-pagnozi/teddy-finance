import { Test } from "@nestjs/testing";
import { CustomersService } from "./customers.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Customer } from "./customer.entity";
import { NotFoundException } from "@nestjs/common";

describe("CustomersService", () => {
  it("creates a customer with defaults", async () => {
    const repo = {
      create: jest.fn((dto) => ({ ...dto })),
      save: jest.fn(async (e) => ({ id: "id1", ...e })),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: repo },
        { provide: "BullQueue_customers", useValue: { add: jest.fn() } },
      ],
    }).compile();

    const service = moduleRef.get(CustomersService);
    const created = await service.create({ name: "John" });
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(created.salary).toBe(0);
    expect(created.company).toBe(0);
  });

  it("lists customers with pagination", async () => {
    const items: Customer[] = [
      { id: "1", name: "A", email: null, phone: null, salary: 0, company: 0, createdAt: new Date(), updatedAt: new Date() },
    ];
    const repo = {
      findAndCount: jest.fn(async () => [items, 1]),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: repo },
        { provide: "BullQueue_customers", useValue: { add: jest.fn() } },
      ],
    }).compile();

    const service = moduleRef.get(CustomersService);
    const result = await service.findAllPaginated(2, 10);
    expect(repo.findAndCount).toHaveBeenCalledWith({ order: { createdAt: "DESC" }, skip: 10, take: 10 });
    expect(result.items).toEqual(items);
    expect(result.total).toBe(1);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(10);
  });

  it("finds one by id or throws", async () => {
    const entity: Customer = { id: "1", name: "A", email: null, phone: null, salary: 0, company: 0, createdAt: new Date(), updatedAt: new Date() };
    const repo = {
      findOne: jest.fn(async ({ where: { id } }: any) => (id === "1" ? entity : null)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: repo },
        { provide: "BullQueue_customers", useValue: { add: jest.fn() } },
      ],
    }).compile();

    const service = moduleRef.get(CustomersService);
    const ok = await service.findOne("1");
    expect(ok).toEqual(entity);
    await expect(service.findOne("x")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updates a customer and saves", async () => {
    const entity: Customer = { id: "1", name: "A", email: null, phone: null, salary: 0, company: 0, createdAt: new Date(), updatedAt: new Date() };
    const repo = {
      findOne: jest.fn(async () => entity),
      save: jest.fn(async (e) => e),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: repo },
        { provide: "BullQueue_customers", useValue: { add: jest.fn() } },
      ],
    }).compile();

    const service = moduleRef.get(CustomersService);
    const updated = await service.update("1", { name: "B" });
    expect(updated.name).toBe("B");
    expect(repo.save).toHaveBeenCalled();
  });

  it("removes a customer or throws when not found", async () => {
    const repo = {
      delete: jest.fn(async (id: string) => ({ affected: id === "1" ? 1 : 0 })),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: repo },
        { provide: "BullQueue_customers", useValue: { add: jest.fn() } },
      ],
    }).compile();

    const service = moduleRef.get(CustomersService);
    await expect(service.remove("1")).resolves.toBeUndefined();
    await expect(service.remove("x")).rejects.toBeInstanceOf(NotFoundException);
  });
});
