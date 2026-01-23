import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common"
import { MarketStatusService } from "./market-status.service"

@Injectable()
export class MarketStatusGuard implements CanActivate {
    constructor(private readonly marketService: MarketStatusService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Vérifie si le marché est ouvert
        const isOpen = await this.marketService.isMarketOpen()

        if (!isOpen) {
            throw new ForbiddenException("Le marché est actuellement fermé. Les transactions ne sont pas autorisées.")
        }

        return true
    }
}
