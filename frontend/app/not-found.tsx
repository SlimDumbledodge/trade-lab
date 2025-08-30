import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Custom404() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">Oups ! La page que vous cherchez n'existe pas.</p>
            <Button>
                <Link href="/" className="px-4 py-2 text-white rounded transition">
                    Retour à l'accueil
                </Link>
            </Button>
        </div>
    );
}
