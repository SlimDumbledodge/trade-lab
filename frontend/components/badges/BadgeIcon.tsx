export function BadgeFirstTrade() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-first-trade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-first-trade)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* dollar sign */}
            <text x="60" y="48" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="sans-serif">
                $
            </text>
            {/* Arrow up */}
            <path d="M60 52 L60 82" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <path
                d="M48 65 L60 52 L72 65"
                stroke="#fff"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Star accent */}
            <circle cx="85" cy="30" r="4" fill="#fde68a" />
        </svg>
    )
}

export function BadgeDiamond() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-diamond" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-diamond)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Diamond shape */}
            <polygon points="60,28 82,55 60,90 38,55" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
            <line x1="38" y1="55" x2="82" y2="55" stroke="#fff" strokeWidth="2" />
            <line x1="60" y1="28" x2="50" y2="55" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
            <line x1="60" y1="28" x2="70" y2="55" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
            <line x1="50" y1="55" x2="60" y2="90" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
            <line x1="70" y1="55" x2="60" y2="90" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
        </svg>
    )
}

export function BadgeStreak() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-streak" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-streak)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Flame */}
            <path d="M60 30 C60 30 75 50 75 65 C75 75 68 85 60 85 C52 85 45 75 45 65 C45 50 60 30 60 30Z" fill="#fde68a" />
            <path d="M60 50 C60 50 68 60 68 68 C68 74 64 80 60 80 C56 80 52 74 52 68 C52 60 60 50 60 50Z" fill="#fb923c" />
            <path
                d="M60 62 C60 62 64 67 64 71 C64 74 62 77 60 77 C58 77 56 74 56 71 C56 67 60 62 60 62Z"
                fill="#fff"
                opacity="0.7"
            />
        </svg>
    )
}

export function BadgePortfolio() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-portfolio" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-portfolio)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Briefcase */}
            <rect x="35" y="48" width="50" height="35" rx="4" fill="none" stroke="#fff" strokeWidth="3" />
            <path d="M48 48 V42 C48 39 51 36 54 36 H66 C69 36 72 39 72 42 V48" fill="none" stroke="#fff" strokeWidth="3" />
            <line x1="35" y1="62" x2="85" y2="62" stroke="#fff" strokeWidth="2" />
            <circle cx="60" cy="62" r="4" fill="#93c5fd" stroke="#fff" strokeWidth="2" />
        </svg>
    )
}

export function BadgeTrophy() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-trophy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-trophy)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Trophy cup */}
            <path d="M42 35 H78 L72 65 H48 Z" fill="#fde68a" stroke="#fff" strokeWidth="2" />
            {/* handles */}
            <path d="M42 40 C32 40 30 52 40 55" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M78 40 C88 40 90 52 80 55" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            {/* base */}
            <line x1="60" y1="65" x2="60" y2="78" stroke="#fff" strokeWidth="3" />
            <rect x="46" y="78" width="28" height="6" rx="2" fill="#fff" opacity="0.9" />
            {/* star */}
            <polygon points="60,42 63,50 71,50 65,55 67,63 60,58 53,63 55,55 49,50 57,50" fill="#fff" opacity="0.9" />
        </svg>
    )
}

export function BadgeRocket() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-rocket" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-rocket)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Rocket body */}
            <path
                d="M60 25 C60 25 76 42 76 62 C76 72 68 80 60 80 C52 80 44 72 44 62 C44 42 60 25 60 25Z"
                fill="#fff"
                opacity="0.9"
            />
            {/* Window */}
            <circle cx="60" cy="52" r="6" fill="#ec4899" />
            <circle cx="60" cy="52" r="4" fill="#fce7f3" />
            {/* Fins */}
            <path d="M44 65 L34 78 L44 72Z" fill="#fce7f3" stroke="#fff" strokeWidth="1" />
            <path d="M76 65 L86 78 L76 72Z" fill="#fce7f3" stroke="#fff" strokeWidth="1" />
            {/* Flame */}
            <path d="M54 80 L60 95 L66 80" fill="#fde68a" opacity="0.9" />
            <path d="M56 80 L60 90 L64 80" fill="#fb923c" opacity="0.8" />
        </svg>
    )
}

export function BadgeShield() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-shield" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-shield)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Shield */}
            <path
                d="M60 28 L85 40 L85 62 C85 78 72 90 60 95 C48 90 35 78 35 62 L35 40 Z"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinejoin="round"
            />
            <path d="M60 34 L80 44 L80 62 C80 75 70 85 60 89 C50 85 40 75 40 62 L40 44 Z" fill="#fff" opacity="0.15" />
            {/* Checkmark */}
            <path
                d="M47 60 L55 70 L73 48"
                stroke="#fff"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function BadgeStar() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-star" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-star)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Big star */}
            <polygon
                points="60,25 68,47 92,47 73,60 80,82 60,69 40,82 47,60 28,47 52,47"
                fill="#fde68a"
                stroke="#fff"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* Inner star highlight */}
            <polygon points="60,35 65,50 80,50 68,58 73,73 60,64 47,73 52,58 40,50 55,50" fill="#fff" opacity="0.3" />
        </svg>
    )
}

export function BadgeChart() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-chart" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-chart)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Bars */}
            <rect x="32" y="65" width="10" height="22" rx="2" fill="#fff" opacity="0.7" />
            <rect x="46" y="50" width="10" height="37" rx="2" fill="#fff" opacity="0.8" />
            <rect x="60" y="55" width="10" height="32" rx="2" fill="#fff" opacity="0.75" />
            <rect x="74" y="38" width="10" height="49" rx="2" fill="#fff" opacity="0.9" />
            {/* Trend line */}
            <polyline
                points="37,62 51,47 65,52 79,35"
                fill="none"
                stroke="#fde68a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="79" cy="35" r="3" fill="#fde68a" />
        </svg>
    )
}

export function BadgeLightning() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-lightning" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-lightning)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Lightning bolt */}
            <polygon
                points="65,25 42,62 56,62 50,95 80,52 64,52 72,25"
                fill="#fff"
                stroke="#fff"
                strokeWidth="1"
                strokeLinejoin="round"
            />
            <polygon points="63,32 47,60 58,60 53,88 76,55 65,55 70,32" fill="#fef9c3" opacity="0.6" />
        </svg>
    )
}

export function BadgeCrown() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-crown" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-crown)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Crown */}
            <path
                d="M30 72 L30 48 L45 58 L60 35 L75 58 L90 48 L90 72 Z"
                fill="#fde68a"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <rect x="30" y="72" width="60" height="10" rx="2" fill="#fde68a" stroke="#fff" strokeWidth="2.5" />
            {/* Gems */}
            <circle cx="45" cy="76" r="3" fill="#f59e0b" />
            <circle cx="60" cy="76" r="3" fill="#f59e0b" />
            <circle cx="75" cy="76" r="3" fill="#f59e0b" />
            {/* Tips */}
            <circle cx="30" cy="47" r="3" fill="#fff" />
            <circle cx="60" cy="34" r="3" fill="#fff" />
            <circle cx="90" cy="47" r="3" fill="#fff" />
        </svg>
    )
}

export function BadgeTarget() {
    return (
        <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g-target" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="56" fill="url(#g-target)" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
            {/* Target rings */}
            <circle cx="60" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="3" />
            <circle cx="60" cy="60" r="20" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.7" />
            <circle cx="60" cy="60" r="10" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
            <circle cx="60" cy="60" r="4" fill="#f87171" />
            {/* Arrow */}
            <line x1="60" y1="60" x2="88" y2="32" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="88,32 80,34 86,40" fill="#fde68a" />
            <line x1="88" y1="32" x2="95" y2="25" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
