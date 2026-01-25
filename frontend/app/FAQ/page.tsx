import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
    {
        question: "Qu’est-ce que Tradelab Studio ?",
        answer: "Tradelab Studio est une plateforme de trading virtuel permettant d’investir sur les marchés financiers avec de vraies données de marché, mais en utilisant de l’argent fictif. Elle vous aide à apprendre et à vous entraîner sans aucun risque financier.",
    },
    {
        question: "Est-ce que les données sont réelles ?",
        answer: "Oui. Les données proviennent directement de l’API Alpaca et reflètent les cours réels du marché boursier en temps réel.",
    },
    {
        question: "À quelle fréquence les données sont-elles mises à jour ?",
        answer: "Les données de marché sont actualisées chaque minute lorsque le marché est ouvert. Les performances globales des portefeuilles sont mises à jour toutes les 15 minutes pour garantir la fiabilité des calculs.",
    },
    {
        question: "Puis-je perdre de l’argent sur Tradelab Studio ?",
        answer: "Non. L’argent utilisé sur Tradelab Studio est entièrement virtuel. Vous pouvez investir, expérimenter et apprendre sans aucun risque de perte réelle.",
    },
    {
        question: "À quoi sert Tradelab Studio si ce n’est pas du vrai trading ?",
        answer: "Tradelab Studio est un environnement d’apprentissage. Il permet de comprendre les mécanismes du marché, d’observer les fluctuations des prix et de tester des stratégies d’investissement sans pression financière.",
    },
    {
        question: "Quels types d’actifs sont disponibles ?",
        answer: "La plateforme se concentre actuellement sur les actions américaines cotées sur les principaux marchés (NASDAQ, NYSE). D’autres classes d’actifs pourront être ajoutées à l’avenir.",
    },
    {
        question: "Comment les performances sont-elles calculées ?",
        answer: "Les performances sont basées sur la valeur totale de vos actifs et votre solde virtuel, selon les cours réels du marché. Les calculs prennent en compte les variations des prix en temps réel.",
    },
    {
        question: "Est-ce que Tradelab Studio est gratuit ?",
        answer: "Oui. L’inscription et l’utilisation de Tradelab Studio sont entièrement gratuites. Aucun dépôt ou moyen de paiement n’est requis.",
    },
    {
        question: "Est-ce que Tradelab Studio fonctionne sur mobile ?",
        answer: "Oui. Tradelab Studio est accessible depuis n’importe quel navigateur web et s’adapte automatiquement aux smartphones, tablettes et ordinateurs.",
    },
    {
        question: "Qu’est-ce que le trading virtuel ?",
        answer: "Le trading virtuel consiste à simuler des achats et ventes d’actifs financiers réels, avec des données en temps réel, mais sans utiliser d’argent véritable.",
    },
    {
        question: "Quelle est la différence entre investir et trader ?",
        answer: "Investir consiste à acheter des actions pour le long terme, en misant sur la croissance d’une entreprise. Trader vise à tirer profit des variations de court terme. Tradelab Studio vous permet de pratiquer les deux approches.",
    },
    {
        question: "Qu’est-ce qu’une action ?",
        answer: "Une action représente une part du capital d’une entreprise. En détenir revient à être copropriétaire d’une fraction de cette société et à bénéficier de la hausse potentielle de son cours.",
    },
    {
        question: "Comment fonctionnent les ordres d’achat et de vente ?",
        answer: "Un ordre d’achat indique votre souhait d’acquérir une action à un prix donné. Un ordre de vente permet de céder une position détenue. Tradelab Studio exécute ces ordres virtuellement selon les prix réels du marché.",
    },
    {
        question: "Puis-je tester des stratégies avancées ?",
        answer: "Oui. Vous pouvez expérimenter différentes approches : diversification, investissement de valeur, trading de tendance, etc. La plateforme reflète fidèlement les variations du marché.",
    },
    {
        question: "Les données affichées sont-elles fiables ?",
        answer: "Oui. Toutes les données proviennent de sources financières professionnelles via l’API Alpaca, assurant précision et cohérence avec les marchés réels.",
    },
    {
        question: "Mes données personnelles sont-elles sécurisées ?",
        answer: "Oui. Tradelab Studio applique des standards de sécurité modernes. Vos informations sont chiffrées et ne sont jamais partagées avec des tiers.",
    },
    {
        question: "Est-ce une vraie plateforme de trading ?",
        answer: "Non. Tradelab Studio est une simulation éducative. Elle reproduit le comportement des marchés pour apprendre à investir, mais aucun ordre réel n’est exécuté.",
    },
    {
        question: "Pourquoi utiliser Tradelab Studio ?",
        answer: "Parce qu’elle combine réalisme des données, simplicité d’utilisation et outils d’analyse complets. C’est un environnement idéal pour apprendre le trading sans stress ni perte financière.",
    },
    {
        question: "Puis-je suivre mes performances dans le temps ?",
        answer: "Oui. Vous pouvez consulter l’évolution de votre portefeuille, vos rendements, vos transactions et vos statistiques détaillées directement depuis votre tableau de bord.",
    },
]

const FAQPage = () => {
    return (
        <section className="py-8 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* En-tête FAQ */}
                <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
                    <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">Besoin d’aide ? Nous avons les réponses</h2>
                    <p className="text-muted-foreground text-xl">
                        Découvrez les questions les plus fréquentes à propos de Tradelab Studio et apprenez à mieux comprendre le
                        trading virtuel.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`}>
                            <AccordionTrigger className="text-lg font-medium">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}

export default FAQPage
