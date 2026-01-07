import { Test, TestingModule } from "@nestjs/testing"
import { PortfoliosSnapshotsService } from "./portfolios-snapshots.service"

describe("PortfoliosHistoryService", () => {
    let service: PortfoliosSnapshotsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PortfoliosSnapshotsService],
        }).compile()

        service = module.get<PortfoliosSnapshotsService>(PortfoliosSnapshotsService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
})
