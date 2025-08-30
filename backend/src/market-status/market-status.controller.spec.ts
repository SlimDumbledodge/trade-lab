import { Test, TestingModule } from '@nestjs/testing';
import { MarketStatusController } from './market-status.controller';
import { MarketStatusService } from './market-status.service';

describe('MarketStatusController', () => {
  let controller: MarketStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketStatusController],
      providers: [MarketStatusService],
    }).compile();

    controller = module.get<MarketStatusController>(MarketStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
