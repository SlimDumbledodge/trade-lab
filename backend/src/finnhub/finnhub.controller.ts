import { Controller } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';

@Controller('finnhub')
export class FinnhubController {
  constructor(private readonly finnhubService: FinnhubService) {}
}
