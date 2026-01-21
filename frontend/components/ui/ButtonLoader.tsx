import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface ButtonLoaderProps {
    children: React.ReactNode
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive"
    className?: string
    type?: "button" | "submit" | "reset"
}

export function ButtonLoader({ children, variant = "secondary", className, type = "button" }: ButtonLoaderProps) {
    return (
        <Button variant={variant} disabled className={className} type={type}>
            {children}
            <Spinner data-icon="inline-start" />
        </Button>
    )
}
