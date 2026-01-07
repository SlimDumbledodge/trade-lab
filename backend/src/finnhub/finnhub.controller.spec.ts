import { Test, TestingModule } from '@nestjs/testing';
import { FinnhubController } from './finnhub.controller';
import { FinnhubService } from './finnhub.service';

describe('FinnhubController', () => {
  let controller: FinnhubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinnhubController],
      providers: [FinnhubService],
    }).compile();

    controller = module.get<FinnhubController>(FinnhubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
