import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActifsService } from './actifs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('actifs')
export class ActifsController {
    constructor(private readonly actifsService: ActifsService) {}
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.actifsService.findAll();
    }
}
