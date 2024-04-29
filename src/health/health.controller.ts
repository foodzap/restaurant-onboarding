import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @ApiOkResponse({ description: 'returns the health check ' })
  @ApiTags('health')
  @Get()
  @HealthCheck()
  getHello() {
    return this.health.check([async () => this.db.pingCheck('typeorm')]);
  }

  @ApiOkResponse({ description: 'returns the health ping check ' })
  @ApiTags('health')
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @ApiOkResponse({ description: 'returns the health check storage' })
  @ApiTags('health')
  @Get('storage')
  @HealthCheck()
  diskStorageCheck() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
    ]);
  }

  @ApiOkResponse({ description: 'returns the health check memory' })
  @ApiTags('health')
  @Get('memory')
  @HealthCheck()
  memoryCheck() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
