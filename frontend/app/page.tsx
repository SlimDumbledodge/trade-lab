import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface LandingProps {
    heading: string;
    description: string;
    buttons?: {
        primary?: {
            text: string;
            url: string;
        };
        secondary?: {
            text: string;
            url: string;
        };
    };
    image: {
        src: string;
        alt: string;
    };
}

const Page = ({
    heading = 'Apprenez le trading sans risque',
    description = 'Simulez des transactions sur les marchés financiers en temps réel avec notre plateforme de trading virtuelle. Parfait pour les débutants et les passionnés qui veulent tester des stratégies sans engager de fonds réels.',
    buttons = {
        primary: {
            text: 'Commencer maintenant',
            url: '/login',
        },
    },
    image = {
        src: '/langing.png',
        alt: 'Image démonstrative de la plateforme de trading virtuelle',
    },
}: LandingProps) => {
    return (
        <section className="py-32">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">{heading}</h1>
                        <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">{description}</p>
                        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                            {buttons.primary && (
                                <Button asChild className="w-full sm:w-auto">
                                    <a href={buttons.primary.url}>{buttons.primary.text}</a>
                                </Button>
                            )}
                        </div>
                    </div>
                    <img
                        src="/landing.png"
                        alt={image.alt}
                        className="w-full max-h-[600px] rounded-md object-cover lg:max-h-[800px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default Page;
