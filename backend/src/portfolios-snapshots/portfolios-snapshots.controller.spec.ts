import { Test, TestingModule } from "@nestjs/testing"
import { PortfoliosHistoryController } from "./portfolios-snapshots.controller"
import { PortfoliosHistoryService } from "./portfolios-snapshots.service"

describe("PortfoliosHistoryController", () => {
    let controller: PortfoliosHistoryController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PortfoliosHistoryController],
            providers: [PortfoliosHistoryService],
        }).compile()

        controller = module.get<PortfoliosHistoryController>(PortfoliosHistoryController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})
