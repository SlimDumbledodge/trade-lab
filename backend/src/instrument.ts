// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs"
import { nodeProfilingIntegration } from "@sentry/profiling-node"

Sentry.init({
    dsn: "https://7176c08f43209136e93fd5f89f8c9ee1@o4510751050301440.ingest.de.sentry.io/4510751054168144",
    integrations: [nodeProfilingIntegration()],
    environment: process.env.NODE_ENV || "development",
    // Tracing
    tracesSampleRate: 0.2, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is evaluated only once per SDK.init call
    profileSessionSampleRate: 1.0,
    // Trace lifecycle automatically enables profiling during active traces
    profileLifecycle: "trace",
})
