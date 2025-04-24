import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-32 flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <ShoppingBag className="h-6 w-6" />
          <span>SmartShelf</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
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
        <div className="ml-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
