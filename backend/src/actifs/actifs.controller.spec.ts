import { Test, TestingModule } from '@nestjs/testing';
import { ActifsController } from './actifs.controller';
import { ActifsService } from './actifs.service';

describe('ActifsController', () => {
    let controller: ActifsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActifsController],
            providers: [ActifsService],
        }).compile();

        controller = module.get<ActifsController>(ActifsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
