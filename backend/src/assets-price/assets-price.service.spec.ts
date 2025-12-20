import { Test, TestingModule } from '@nestjs/testing';
import { AssetsPriceService } from './assets-price.service';

describe('AssetsPriceService', () => {
  let service: AssetsPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsPriceService],
    }).compile();

    service = module.get<AssetsPriceService>(AssetsPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
