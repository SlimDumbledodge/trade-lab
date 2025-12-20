import { Controller, Get } from "@nestjs/common"
import { AlpacaService } from "./alpaca.service"
import { TimeframeEnum } from "./types/alpaca.types"
import * as moment from "moment"

@Controller("alpaca")
export class AlpacaController {
    constructor(private readonly alpacaService: AlpacaService) {}

}
