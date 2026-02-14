import { Test, TestingModule } from "@nestjs/testing"
import { MarketStatusService } from "./market-status.service"
import { PrismaService } from "../prisma/prisma.service"

// Mock moment-timezone
const mockMoment = jest.fn()
jest.mock("moment-timezone", () => {
    const actual = jest.requireActual("moment-timezone")
    return (...args: unknown[]) => {
        if (args.length === 0) return mockMoment()
        return actual(...args)
    }
})

describe("MarketStatusService", () => {
    let service: MarketStatusService

    const mockPrismaService = {
        marketCalendar: {
            findFirst: jest.fn(),
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MarketStatusService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile()

        service = module.get<MarketStatusService>(MarketStatusService)

        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("isMarketOpen", () => {
        it("devrait retourner true quand le marché est ouvert (now entre open et close)", async () => {
            // Simuler : maintenant = 15h00, ouverture 9h30, fermeture 16h00
            const fakeNow = {
                format: jest.fn().mockReturnValue("2026-02-13"),
                isBetween: jest.fn().mockReturnValue(true),
            }
            mockMoment.mockReturnValue(fakeNow)

            mockPrismaService.marketCalendar.findFirst.mockResolvedValue({
                date: "2026-02-13",
                openTime: new Date("2026-02-13T14:30:00Z"),
                closeTime: new Date("2026-02-13T21:00:00Z"),
            })

            const result = await service.isMarketOpen()

            expect(result).toBe(true)
            expect(fakeNow.format).toHaveBeenCalledWith("YYYY-MM-DD")
            expect(fakeNow.isBetween).toHaveBeenCalled()
        })

        it("devrait retourner false quand le marché est fermé (now hors de open-close)", async () => {
            const fakeNow = {
                format: jest.fn().mockReturnValue("2026-02-13"),
                isBetween: jest.fn().mockReturnValue(false),
            }
            mockMoment.mockReturnValue(fakeNow)

            mockPrismaService.marketCalendar.findFirst.mockResolvedValue({
                date: "2026-02-13",
                openTime: new Date("2026-02-13T14:30:00Z"),
                closeTime: new Date("2026-02-13T21:00:00Z"),
            })

            const result = await service.isMarketOpen()

            expect(result).toBe(false)
        })

        it("devrait retourner false quand il n'y a pas d'entrée pour aujourd'hui (weekend/jour férié)", async () => {
            const fakeNow = {
                format: jest.fn().mockReturnValue("2026-02-14"),
            }
            mockMoment.mockReturnValue(fakeNow)

            mockPrismaService.marketCalendar.findFirst.mockResolvedValue(null)

            const result = await service.isMarketOpen()

            expect(result).toBe(false)
        })
    })

    describe("getMarketStatus", () => {
        const mockNextDay = {
            date: "2026-02-16",
            openTime: new Date("2026-02-16T14:30:00Z"),
            closeTime: new Date("2026-02-16T21:00:00Z"),
        }

        const mockPreviousDay = {
            date: "2026-02-12",
            openTime: new Date("2026-02-12T14:30:00Z"),
            closeTime: new Date("2026-02-12T21:00:00Z"),
        }

        it("devrait retourner isOpen=true avec todayMarketInfos quand le marché est ouvert", async () => {
            const todayInfos = {
                date: "2026-02-13",
                openTime: new Date("2026-02-13T14:30:00Z"),
                closeTime: new Date("2026-02-13T21:00:00Z"),
            }

            // Mock isMarketOpen → true
            const fakeNow = {
                format: jest.fn().mockReturnValue("2026-02-13"),
                isBetween: jest.fn().mockReturnValue(true),
            }
            mockMoment.mockReturnValue(fakeNow)

            // findFirst sera appelé plusieurs fois :
            // 1) isMarketOpen → entrée aujourd'hui
            // 2) getMarketStatus → todayMarketInfos
            // 3) getNextMarketOpenDay
            // 4) getPreviousMarketOpenDay
            mockPrismaService.marketCalendar.findFirst
                .mockResolvedValueOnce(todayInfos) // isMarketOpen
                .mockResolvedValueOnce(todayInfos) // todayMarketInfos
                .mockResolvedValueOnce(mockNextDay) // getNextMarketOpenDay
                .mockResolvedValueOnce(mockPreviousDay) // getPreviousMarketOpenDay

            const result = await service.getMarketStatus()

            expect(result.isOpen).toBe(true)
            expect(result.todayMarketInfos).toEqual(todayInfos)
            expect(result.nextDayMarketInfos).toEqual(mockNextDay)
            expect(result.previousDayMarketInfos).toEqual(mockPreviousDay)
        })

        it("devrait retourner isOpen=false avec todayMarketInfos=null quand le marché est fermé", async () => {
            const fakeNow = {
                format: jest.fn().mockReturnValue("2026-02-14"),
            }
            mockMoment.mockReturnValue(fakeNow)

            // isMarketOpen → pas d'entrée pour aujourd'hui → false
            mockPrismaService.marketCalendar.findFirst
                .mockResolvedValueOnce(null) // isMarketOpen → null → false
                .mockResolvedValueOnce(mockNextDay) // getNextMarketOpenDay
                .mockResolvedValueOnce(mockPreviousDay) // getPreviousMarketOpenDay

            const result = await service.getMarketStatus()

            expect(result.isOpen).toBe(false)
            expect(result.todayMarketInfos).toBeNull()
            expect(result.nextDayMarketInfos).toEqual(mockNextDay)
            expect(result.previousDayMarketInfos).toEqual(mockPreviousDay)
        })

        it("devrait throw si aucun prochain jour de marché n'est trouvé", async () => {
            const fakeNow = {
                format: jest.fn().mockReturnValue("2026-02-14"),
            }
            mockMoment.mockReturnValue(fakeNow)

            mockPrismaService.marketCalendar.findFirst
                .mockResolvedValueOnce(null) // isMarketOpen
                .mockResolvedValueOnce(null) // getNextMarketOpenDay → null → throw

            await expect(service.getMarketStatus()).rejects.toThrow("getNextMarketOpenDay : Imposible de déterminer le next day")
        })

        it("devrait throw si aucun jour de marché précédent n'est trouvé", async () => {
            const fakeNow = {
                format: jest.fn().mockReturnValue("2026-02-14"),
            }
            mockMoment.mockReturnValue(fakeNow)

            mockPrismaService.marketCalendar.findFirst
                .mockResolvedValueOnce(null) // isMarketOpen
                .mockResolvedValueOnce(mockNextDay) // getNextMarketOpenDay
                .mockResolvedValueOnce(null) // getPreviousMarketOpenDay → null → throw

            await expect(service.getMarketStatus()).rejects.toThrow("getPreviousMarketOpenDay : Imposible de déterminer le previous day")
        })
    })
})
