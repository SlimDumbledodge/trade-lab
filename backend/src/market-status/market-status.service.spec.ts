import { Test, TestingModule } from '@nestjs/testing';
import { MarketStatusService } from './market-status.service';

describe('MarketStatusService', () => {
  let service: MarketStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketStatusService],
    }).compile();

    service = module.get<MarketStatusService>(MarketStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
