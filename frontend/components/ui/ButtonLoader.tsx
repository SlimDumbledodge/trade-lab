import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface ButtonLoaderProps {
    children: React.ReactNode
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive"
    className?: string
    type?: "button" | "submit" | "reset"
    disabled?: boolean
    isLoading?: boolean
}

export function ButtonLoader({
    children,
    variant = "secondary",
    className,
    type = "button",
    disabled,
    isLoading,
}: ButtonLoaderProps) {
    // Rétrocompatibilité : sans isLoading, le bouton est toujours disabled avec spinner
    const showSpinner = isLoading === undefined ? true : isLoading
    const isDisabled = disabled === undefined && isLoading === undefined ? true : disabled || showSpinner

    return (
        <Button variant={variant} disabled={isDisabled} className={className} type={type}>
            {children}
            {showSpinner && <Spinner data-icon="inline-start" />}
        </Button>
    )
}
