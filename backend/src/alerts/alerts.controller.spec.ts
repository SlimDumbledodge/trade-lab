import { Test, TestingModule } from "@nestjs/testing"
import { AlertsController } from "./alerts.controller"
import { AlertsService } from "./alerts.service"
import { PrismaService } from "../prisma/prisma.service"

describe("AlertsController", () => {
    let controller: AlertsController

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
            controllers: [AlertsController],
            providers: [AlertsService, { provide: PrismaService, useValue: mockPrismaService }],
        }).compile()

        controller = module.get<AlertsController>(AlertsController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
