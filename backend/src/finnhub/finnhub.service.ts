import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class FinnhubService {
    private readonly logger = new Logger(FinnhubService.name)
    private readonly token: string
    private readonly baseUrl: string
    private readonly companyProfilUrl: string

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        this.token = this.configService.get<string>("FINNHUB_API_KEY")!
        this.baseUrl = this.configService.get<string>("FINNHUB_BASE_URL")!
        this.companyProfilUrl = this.configService.get<string>("FINNHUB_BASE_COMPANY_PROFIL_URL")!
    }

    private get getTokenQueryString(): string {
        return `&token=${this.token}`
    }

    async updateCompanyProfil() {
        const assets = await this.prisma.asset.findMany()
        if (!assets.length) {
            this.logger.fatal(`updateCompanyProfil : Aucun assets trouvé`)
            throw new Error(`updateCompanyProfil : Aucun assets trouvé`)
        }
        for (const asset of assets) {
            try {
                const response = await axios.get(`${this.baseUrl}${this.companyProfilUrl}${asset.symbol}${this.getTokenQueryString}`)
                const companyProfil = response.data
                if (!companyProfil) {
                    this.logger.warn(`updateCompanyProfil : No profile found for ${asset.symbol}`)
                    continue
                }

                await this.prisma.asset.update({
                    where: { id: asset.id },
                    data: {
                        logo: companyProfil.logo,
                        category: companyProfil.finnhubIndustry,
                    },
                })

                this.logger.log(`✅ ${asset.symbol}: profil mis à jour`)
            } catch (e) {
                this.logger.error(`updateCompanyProfil ❌ Erreur pour ${asset.symbol}: ${e.message}`, e.stack)
            }
        }
    }
}
