import { Controller } from '@nestjs/common';
import { PortfoliosHistoryService } from './portfolios-history.service';

@Controller('portfolios-history')
export class PortfoliosHistoryController {
  constructor(private readonly portfoliosHistoryService: PortfoliosHistoryService) {}
}
