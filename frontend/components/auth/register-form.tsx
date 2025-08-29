'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    const router = useRouter();
    const [signupForm, setSignupForm] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupForm),
        });

        if (res.ok) {
            const loginRes = await signIn('credentials', {
                email: signupForm.email,
                password: signupForm.password,
                redirect: false,
            });

            if (!loginRes?.error) {
                router.push('/dashboard');
            } else {
                console.error('Erreur de connexion :', loginRes.error);
            }
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <form onSubmit={handleSignUp}>
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
                            <Input
                                id="username"
                                type="text"
                                placeholder="Votre pseudo"
                                required
                                value={signupForm.username}
                                onChange={(e) =>
                                    setSignupForm({
                                        ...signupForm,
                                        username: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="exemple@email.com"
                                required
                                value={signupForm.email}
                                onChange={(e) =>
                                    setSignupForm({
                                        ...signupForm,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                required
                                value={signupForm.password}
                                onChange={(e) =>
                                    setSignupForm({
                                        ...signupForm,
                                        password: e.target.value,
                                    })
                                }
                            />
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
