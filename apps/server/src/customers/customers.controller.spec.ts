import { Test } from "@nestjs/testing";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { CacheModule } from "@nestjs/cache-manager";

describe("CustomersController", () => {
  it("returns paginated customers through service", async () => {
    const service = {
      findAllPaginated: jest.fn(async (page: number, pageSize: number) => ({
        items: [],
        total: 0,
        page,
        pageSize,
      })),
    } as unknown as CustomersService;

    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CustomersController],
      providers: [{ provide: CustomersService, useValue: service }],
    }).compile();

    const controller = moduleRef.get(CustomersController);
    const result = await controller.findAll({ page: 3, pageSize: 5 } as any);
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(5);
  });
});
