import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosAssetsController } from './portfolios-assets.controller';
import { PortfoliosAssetsService } from './portfolios-assets.service';

describe('PortfoliosAssetsController', () => {
  let controller: PortfoliosAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfoliosAssetsController],
      providers: [PortfoliosAssetsService],
    }).compile();

    controller = module.get<PortfoliosAssetsController>(PortfoliosAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
