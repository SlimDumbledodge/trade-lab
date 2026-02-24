import { Test, TestingModule } from "@nestjs/testing"
import { NotificationsController } from "./notifications.controller"
import { NotificationsService } from "./notifications.service"
import { PrismaService } from "../prisma/prisma.service"

describe("NotificationsController", () => {
    let controller: NotificationsController

    const mockPrismaService = {
        notification: {
            findMany: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
            create: jest.fn(),
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [NotificationsService, { provide: PrismaService, useValue: mockPrismaService }],
        }).compile()

        controller = module.get<NotificationsController>(NotificationsController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
