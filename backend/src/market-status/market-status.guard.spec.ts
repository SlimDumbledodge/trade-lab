import { Test, TestingModule } from "@nestjs/testing"
import { ForbiddenException } from "@nestjs/common"
import { MarketStatusGuard } from "./market-status.guard"
import { MarketStatusService } from "./market-status.service"
import { ExecutionContext } from "@nestjs/common"

describe("MarketStatusGuard", () => {
    let guard: MarketStatusGuard

    const mockMarketStatusService = {
        isMarketOpen: jest.fn(),
    }

    // Mock minimal d'ExecutionContext (le guard ne l'utilise pas)
    const mockExecutionContext = {} as ExecutionContext

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MarketStatusGuard,
                {
                    provide: MarketStatusService,
                    useValue: mockMarketStatusService,
                },
            ],
        }).compile()

        guard = module.get<MarketStatusGuard>(MarketStatusGuard)

        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(guard).toBeDefined()
    })

    it("devrait retourner true quand le marché est ouvert", async () => {
        mockMarketStatusService.isMarketOpen.mockResolvedValue(true)

        const result = await guard.canActivate(mockExecutionContext)

        expect(result).toBe(true)
        expect(mockMarketStatusService.isMarketOpen).toHaveBeenCalledTimes(1)
    })

    it("devrait lancer ForbiddenException quand le marché est fermé", async () => {
        mockMarketStatusService.isMarketOpen.mockResolvedValue(false)

        await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(ForbiddenException)
        await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
            "Le marché est actuellement fermé. Les transactions ne sont pas autorisées.",
        )
    })
})
