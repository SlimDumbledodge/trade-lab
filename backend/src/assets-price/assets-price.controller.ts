import { Controller } from "@nestjs/common"
import { AssetsPriceService } from "./assets-price.service"

@Controller("assets-price")
export class AssetsPriceController {
    constructor(private readonly assetsPriceService: AssetsPriceService) {}
}
