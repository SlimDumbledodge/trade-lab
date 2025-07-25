import { Test, TestingModule } from '@nestjs/testing';
import { ActifsService } from './actifs.service';

describe('ActifsService', () => {
    let service: ActifsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ActifsService],
        }).compile();

        service = module.get<ActifsService>(ActifsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
