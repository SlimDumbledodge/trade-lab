import { Test, TestingModule } from "@nestjs/testing"
import { MarketStatusController } from "./market-status.controller"
import { MarketStatusService } from "./market-status.service"

describe("MarketStatusController", () => {
    let controller: MarketStatusController
    let marketStatusService: MarketStatusService

    const mockMarketStatusService = {
        getMarketStatus: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MarketStatusController],
            providers: [
                {
                    provide: MarketStatusService,
                    useValue: mockMarketStatusService,
                },
            ],
        }).compile()

        controller = module.get<MarketStatusController>(MarketStatusController)
        marketStatusService = module.get<MarketStatusService>(MarketStatusService)

        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    describe("getMarketStatus", () => {
        it("devrait retourner le statut complet du marché quand il est ouvert", async () => {
            const mockResult = {
                isOpen: true,
                todayMarketInfos: {
                    date: "2026-02-13",
                    openTime: new Date("2026-02-13T14:30:00Z"),
                    closeTime: new Date("2026-02-13T21:00:00Z"),
                },
                nextDayMarketInfos: {
                    date: "2026-02-16",
                    openTime: new Date("2026-02-16T14:30:00Z"),
                    closeTime: new Date("2026-02-16T21:00:00Z"),
                },
                previousDayMarketInfos: {
                    date: "2026-02-12",
                    openTime: new Date("2026-02-12T14:30:00Z"),
                    closeTime: new Date("2026-02-12T21:00:00Z"),
                },
            }

            mockMarketStatusService.getMarketStatus.mockResolvedValue(mockResult)

            const result = await controller.getMarketStatus()

            expect(result).toEqual(mockResult)
            expect(marketStatusService.getMarketStatus).toHaveBeenCalledTimes(1)
        })

        it("devrait retourner le statut avec todayMarketInfos=null quand le marché est fermé", async () => {
            const mockResult = {
                isOpen: false,
                todayMarketInfos: null,
                nextDayMarketInfos: {
                    date: "2026-02-16",
                    openTime: new Date("2026-02-16T14:30:00Z"),
                    closeTime: new Date("2026-02-16T21:00:00Z"),
                },
                previousDayMarketInfos: {
                    date: "2026-02-12",
                    openTime: new Date("2026-02-12T14:30:00Z"),
                    closeTime: new Date("2026-02-12T21:00:00Z"),
                },
            }

            mockMarketStatusService.getMarketStatus.mockResolvedValue(mockResult)

            const result = await controller.getMarketStatus()

            expect(result).toEqual(mockResult)
            expect(result.isOpen).toBe(false)
            expect(result.todayMarketInfos).toBeNull()
        })
    })
})
