"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-sm-0 flex h-16 items-center justify-between px-4 md:px-32 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <ShoppingBag className="h-6 w-6" />
          <span>SmartShelf</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden ml-auto gap-4 sm:gap-6 sm:flex">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/functions" className="text-sm font-medium hover:underline underline-offset-4">
            Functions
          </Link>
        </nav>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          className="ml-auto sm:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mode Toggle */}
        <div className="hidden ml-4 sm:block">
          <ModeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="flex flex-col gap-4 p-4 sm:hidden border-t bg-background">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/functions"
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Functions
          </Link>
          <div className="mt-4">
            <ModeToggle />
          </div>
        </nav>
      )}
    </header>
  )
}