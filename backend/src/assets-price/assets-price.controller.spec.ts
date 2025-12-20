import { Test, TestingModule } from '@nestjs/testing';
import { AssetsPriceController } from './assets-price.controller';
import { AssetsPriceService } from './assets-price.service';

describe('AssetsPriceController', () => {
  let controller: AssetsPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsPriceController],
      providers: [AssetsPriceService],
    }).compile();

    controller = module.get<AssetsPriceController>(AssetsPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
