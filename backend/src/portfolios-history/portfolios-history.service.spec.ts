import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosHistoryService } from './portfolios-history.service';

describe('PortfoliosHistoryService', () => {
  let service: PortfoliosHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfoliosHistoryService],
    }).compile();

    service = module.get<PortfoliosHistoryService>(PortfoliosHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
