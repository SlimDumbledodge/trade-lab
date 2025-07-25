import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActifsService } from './actifs.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('actifs')
export class ActifsController {
    constructor(private readonly actifsService: ActifsService) {}

    @Get()
    @UseGuards(AuthGuard)
    findAll() {
        return this.actifsService.findAll();
    }
}
