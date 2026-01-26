import React, { Suspense } from "react"
import ResetPassword from "@/components/forms/ResetPasswordForm"

export default function Page() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ResetPassword />
        </Suspense>
    )
}
