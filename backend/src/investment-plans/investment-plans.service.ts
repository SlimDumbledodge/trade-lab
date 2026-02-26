import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { CreateInvestmentPlanDto } from "./dto/create-investment-plan.dto"
import { UpdateInvestmentPlanDto } from "./dto/update-investment-plan.dto"

@Injectable()
export class InvestmentPlansService {
    constructor(private readonly prisma: PrismaService) {}

    async getInvestmentPlans(userId: number) {
        return this.prisma.investmentPlans.findMany({
            where: { userId },
            include: { asset: true },
        })
    }

    async createInvestmentPlan(userId: number, dto: CreateInvestmentPlanDto) {
        const asset = await this.prisma.asset.findUnique({ where: { id: dto.assetId } })
        if (!asset) {
            throw new NotFoundException(`L'actif avec l'ID ${dto.assetId} n'existe pas`)
        }

        const existing = await this.prisma.investmentPlans.findFirst({
            where: { userId, assetId: dto.assetId },
        })
        if (existing) {
            throw new ConflictException(`Un plan d'investissement existe déjà pour cet actif`)
        }

        return this.prisma.investmentPlans.create({
            data: {
                userId,
                assetId: dto.assetId,
                frequency: dto.frequency,
                firstExecution: dto.firstExecution,
                amount: dto.amount,
                isFirstExecution: true,
                nextExecutionAt: null,
            },
        })
    }

    async updateInvestmentPlan(userId: number, planId: number, dto: UpdateInvestmentPlanDto) {
        const plan = await this.prisma.investmentPlans.findUnique({ where: { id: planId } })
        if (!plan) {
            throw new NotFoundException(`Le plan d'investissement #${planId} n'existe pas`)
        }
        if (plan.userId !== userId) {
            throw new ForbiddenException("Vous n'avez pas accès à ce plan d'investissement")
        }

        return this.prisma.investmentPlans.update({
            where: { id: planId },
            data: {
                frequency: dto.frequency,
                firstExecution: dto.firstExecution,
                amount: dto.amount,
            },
        })
    }

    async deleteInvestmentPlan(userId: number, planId: number) {
        const plan = await this.prisma.investmentPlans.findUnique({ where: { id: planId, userId: userId } })
        if (!plan) {
            throw new NotFoundException(`Le plan d'investissement #${planId} n'existe pas`)
        }
        return this.prisma.investmentPlans.delete({
            where: { id: planId },
        })
    }
}
