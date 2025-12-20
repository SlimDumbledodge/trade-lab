import { Test, TestingModule } from '@nestjs/testing';
import { AlpacaService } from './alpaca.service';

describe('AlpacaService', () => {
  let service: AlpacaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlpacaService],
    }).compile();

    service = module.get<AlpacaService>(AlpacaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
