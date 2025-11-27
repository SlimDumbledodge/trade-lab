import { PartialType } from '@nestjs/swagger';
import { CreatePortfoliosAssetDto } from './create-portfolios-asset.dto';

export class UpdatePortfoliosAssetDto extends PartialType(CreatePortfoliosAssetDto) {}
