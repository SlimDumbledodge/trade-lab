"use client"

import { FacebookIcon, Github, InstagramIcon, Linkedin, TwitterIcon, YoutubeIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="text-sm">
            <Separator />

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-4 sm:px-6 md:flex-row md:justify-between md:gap-6 md:py-6">
                {/* Logo */}
                <div className="flex items-center gap-2 text-xs md:text-sm">
                    <Image src="/icon.png" alt="Logo TradeLab" width={15} height={15} />
                    <span className="font-semibold">tradelab/studio</span>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap items-center gap-4 justify-center text-xs md:text-sm">
                    <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        FAQ
                    </a>
                    <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        Mentions légales
                    </a>
                    <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        Politique de confidentialité
                    </a>
                    <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        Nous contacter
                    </a>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3 text-xs md:text-sm">
                    <a href="#" aria-label="GitHub">
                        <Github className="size-4" />
                    </a>
                    <a href="#" aria-label="LinkedIn">
                        <Linkedin className="size-4" />
                    </a>
                </div>
            </div>

            {/* Bottom copyright / disclaimer */}
            <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 text-center text-[10px] md:text-xs">
                © {new Date().getFullYear()}{" "}
                <a href="#" className="hover:underline">
                    shadcn/studio
                </a>
                , Made with ❤️ for better web.
            </div>
        </footer>
    )
}
