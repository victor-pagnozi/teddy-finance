import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/')
  root() {
    return { status: 'ok', service: 'teddy-api' };
  }

  @Get('/health')
  health() {
    return { status: 'up' };
  }
}
