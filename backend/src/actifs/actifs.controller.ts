import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

    @Get(':symbol/profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Param('symbol') symbol: string) {
        return this.actifsService.getCompanyProfile(symbol);
    }

    @Get(':symbol')
    @UseGuards(JwtAuthGuard)
    async getActif(@Param('symbol') symbol: string) {
        return this.actifsService.findActif(symbol);
    }
}
