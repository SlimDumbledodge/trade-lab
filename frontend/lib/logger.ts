type LogLevel = "info" | "warn" | "error"

interface LogEntry {
    level: LogLevel
    message: string
    data?: any
    timestamp: string
    url?: string
    userAgent?: string
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === "development"

    private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
        return {
            level,
            message,
            data,
            timestamp: new Date().toISOString(),
            url: typeof window !== "undefined" ? window.location.href : undefined,
            userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
        }
    }

    private sendToServer(entry: LogEntry) {
        // En production, envoyer à un service de logging
        // TODO: Implémenter l'envoi à Sentry, LogRocket, ou votre backend
        if (!this.isDevelopment) {
            // fetch('/api/logs', {
            //     method: 'POST',
            //     body: JSON.stringify(entry)
            // }).catch(() => {})
        }
    }

    info(message: string, data?: any) {
        const entry = this.createLogEntry("info", message, data)
        if (this.isDevelopment) {
            console.log(`ℹ️ [INFO] ${message}`, data)
        }
        this.sendToServer(entry)
    }

    warn(message: string, data?: any) {
        const entry = this.createLogEntry("warn", message, data)
        if (this.isDevelopment) {
            console.warn(`⚠️ [WARN] ${message}`, data)
        }
        this.sendToServer(entry)
    }

    error(message: string, error?: Error | any) {
        const entry = this.createLogEntry("error", message, {
            error: error?.message,
            stack: error?.stack,
            ...error,
        })

        // Toujours logger les erreurs en console (même en prod pour debug navigateur)
        console.error(`❌ [ERROR] ${message}`, error)

        this.sendToServer(entry)
    }
}

export const logger = new Logger()
