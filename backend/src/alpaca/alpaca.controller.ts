import { Controller } from "@nestjs/common"
import { AlpacaService } from "./alpaca.service"

@Controller("alpaca")
export class AlpacaController {
    constructor(private readonly alpacaService: AlpacaService) {}
}
