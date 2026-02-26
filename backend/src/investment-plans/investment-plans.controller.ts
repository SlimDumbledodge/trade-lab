import { Body, Controller, Get, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common"
import { InvestmentPlansService } from "./investment-plans.service"
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"
import { GetUser } from "src/common/decorators/user.decorator"
import { CreateInvestmentPlanDto } from "./dto/create-investment-plan.dto"
import { UpdateInvestmentPlanDto } from "./dto/update-investment-plan.dto"

@Controller("investment-plans")
@UseGuards(JwtAuthGuard)
export class InvestmentPlansController {
    constructor(private readonly investmentPlansService: InvestmentPlansService) {}

    @Get()
    getInvestmentPlans(@GetUser("id") userId: number) {
        return this.investmentPlansService.getInvestmentPlans(userId)
    }

    @Post()
    createInvestmentPlan(@GetUser("id") userId: number, @Body() createInvestmentPlan: CreateInvestmentPlanDto) {
        return this.investmentPlansService.createInvestmentPlan(userId, createInvestmentPlan)
    }

    @Patch(":id")
    updateInvestmentPlan(@GetUser("id") userId: number, @Param("id", ParseIntPipe) planId: number, @Body() dto: UpdateInvestmentPlanDto) {
        return this.investmentPlansService.updateInvestmentPlan(userId, planId, dto)
    }

    @Delete(":id")
    deleteInvestmentPlan(@GetUser("id") userId: number, @Param("id", ParseIntPipe) planId: number) {
        return this.investmentPlansService.deleteInvestmentPlan(userId, planId)
    }
}
