"use client"

import { FacebookIcon, Github, InstagramIcon, Linkedin, TwitterIcon, YoutubeIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="text-sm">
            <Separator />
            <div className="mx-auto  flex max-w flex-col items-center gap-3 px-4 py-3 sm:px-6 md:flex-row md:justify-between md:gap-4 md:py-4">
                {/* Logo */}
                <div className="flex items-center gap-2 text-xs md:text-sm">
                    <Image src="/icon.png" alt="Logo Tradelab" width={15} height={15} />
                    <span className="font-semibold">tradelab/studio</span>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap items-center gap-4 justify-center text-xs md:text-xs">
                    <Link href="/FAQ" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        FAQ
                    </Link>
                    <Link href="/legal" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        Mentions légales
                    </Link>
                    <Link href="/privacy" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        Politique de confidentialité
                    </Link>
                    <Link href="/contact" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
                        Nous contacter
                    </Link>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3 text-xs md:text-sm">
                    <Link href="https://github.com/SlimDumbledodge/trade-lab" target="_blank" aria-label="GitHub">
                        <Github className="size-4" />
                    </Link>
                    <Link href="https://linkedin.com/in/amael-rosales" target="_blank" aria-label="LinkedIn">
                        <Linkedin className="size-4" />
                    </Link>
                </div>
            </div>
        </footer>
    )
}
