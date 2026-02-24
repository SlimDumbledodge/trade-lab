import { Test, TestingModule } from "@nestjs/testing"
import { AlertsService } from "./alerts.service"
import { PrismaService } from "../prisma/prisma.service"

describe("AlertsService", () => {
    let service: AlertsService

    const mockPrismaService = {
        alert: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AlertsService, { provide: PrismaService, useValue: mockPrismaService }],
        }).compile()

        service = module.get<AlertsService>(AlertsService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
