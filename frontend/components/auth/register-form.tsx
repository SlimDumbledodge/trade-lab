import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <form>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a href="#" className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <Image src="/icon.png" alt="Logo" width={35} height={35} />
                            </div>
                        </a>
                        <h1 className="text-xl font-bold">Créer un compte TradeLab</h1>
                        <div className="text-center text-sm">
                            Vous avez déjà un compte ?{' '}
                            <a href="#" className="underline underline-offset-4">
                                Connectez-vous
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="username">Pseudo</Label>
                            <Input id="username" type="text" placeholder="Votre pseudo" required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" placeholder="exemple@email.com" required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input id="password" type="password" placeholder="********" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Créer un compte
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
