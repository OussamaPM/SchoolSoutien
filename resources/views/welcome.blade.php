<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }} — Bientôt</title>

    <link rel="icon"
        href="/favicon.ico"
        sizes="any">
    <link rel="icon"
        href="/favicon.svg"
        type="image/svg+xml">
    <link rel="apple-touch-icon"
        href="/apple-touch-icon.png">

    <link rel="preconnect"
        href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
        rel="stylesheet" />

    @vite(['resources/css/app.css'])
    <style>
        /* slow spin for decorative element */
        @keyframes spin-slow {
            from {
                transform: rotate(0);
            }

            to {
                transform: rotate(360deg);
            }
        }

        /* subtle gradient shift for the heading */
        @keyframes gradientShift {
            0% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0% 50%;
            }
        }

        .spin-slow {
            animation: spin-slow 18s linear infinite;
        }

        .heading-gradient {
            background: linear-gradient(90deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 1));
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradientShift 6s ease infinite;
        }

        /* utility to avoid accidental horizontal scroll from decorative elements */
        .no-scroll-x {
            overflow-x: hidden;
        }
    </style>
</head>

<body
    class="antialiased font-sans bg-gradient-to-br from-primary-800 via-primary-600 to-pink-500 min-h-screen flex items-center justify-center no-scroll-x">
    <div class="relative w-full max-w-6xl px-6 py-16 lg:py-24">
        <!-- Decorative blurred shapes (smaller to avoid overflow) -->
        <div aria-hidden="true"
            class="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-primary-500/30 blur-3xl spin-slow mix-blend-multiply opacity-60 pointer-events-none">
        </div>
        <div aria-hidden="true"
            class="absolute -bottom-16 -right-12 w-72 h-72 rounded-full bg-pink-400/25 blur-3xl animate-pulse mix-blend-overlay opacity-55 pointer-events-none">
        </div>

        <!-- Glass card to lift content -->
        <main
            class="relative z-10 mx-auto w-full bg-white/6 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center text-white">
            <img src="{{ asset('schoolsoutien-logo.webp') }}"
                alt="{{ config('app.name') }}"
                class="h-24 w-auto mb-6 drop-shadow-2xl" />

            <h1
                class="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl heading-gradient">
                Bientôt disponible
            </h1>

            <p class="mb-6 max-w-2xl text-lg sm:text-xl text-white/90">
                Nous préparons quelque chose d\'extraordinaire pour les élèves
                et les enseignants — une plateforme plus rapide, plus simple et
                plus utile.
            </p>

            <div class="mb-8 flex flex-col items-center gap-4 sm:flex-row">
                @guest
                    <a href="{{ route('login') }}"
                        class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary-500 to-pink-400 px-6 py-3 text-sm font-semibold text-white shadow-xl transform transition hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30">
                        Se connecter
                    </a>

                    <a href="{{ route('register') }}"
                        class="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/95 shadow-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30">
                        S'inscrire
                    </a>
                @endguest

                @auth
                    <a href="{{ route('dashboard') }}"
                        class="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary-500 to-pink-400 px-6 py-3 text-sm font-semibold text-white shadow-xl transform transition hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30">
                        Aller au tableau de bord
                    </a>
                @endauth
            </div>

            <div class="mt-4 flex items-center gap-3 text-sm text-white/80">
                <svg class="h-5 w-5 text-white/75"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden>
                    <path d="M12 2v6"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M12 16v6"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M4 9l4 3"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M20 9l-4 3"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
                <span>Envie d'une démo privée ? Contactez-nous et nous
                    organiserons une présentation.</span>
            </div>
        </main>

        <footer class="relative z-10 mt-10 text-center text-xs text-white/70">
            © {{ date('Y') }} {{ config('app.name') }} — Tous droits
            réservés
        </footer>

    </div>
</body>

</html>
