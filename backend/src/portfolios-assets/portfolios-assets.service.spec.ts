import { Test, TestingModule } from "@nestjs/testing"
import { PortfoliosAssetsService } from "./portfolios-assets.service"

describe("PortfoliosAssetsService", () => {
    let service: PortfoliosAssetsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PortfoliosAssetsService],
        }).compile()

        service = module.get<PortfoliosAssetsService>(PortfoliosAssetsService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
