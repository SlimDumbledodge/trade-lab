import * as dotenv from "dotenv"
import * as path from "path"

// Charge le fichier .env.test AVANT que l'application ne démarre
dotenv.config({ path: path.resolve(__dirname, "../.env.test") })
