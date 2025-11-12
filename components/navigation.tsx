"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white/98 backdrop-blur-sm border-b border-[#E8F4F5] sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-xl md:text-2xl text-[#28436C] group-hover:text-[#30A3B0] transition-colors font-medium">
              The Melbourne Counsellor
            </span>
            <span className="text-xs md:text-sm text-[#2A7477]/70">Dan Lobel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-[#2A7477]/80 hover:text-[#30A3B0] transition-colors text-sm font-medium tracking-wide"
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="text-[#2A7477]/80 hover:text-[#30A3B0] transition-colors text-sm font-medium tracking-wide"
            >
              About
            </Link>
            <Link
              href="/#services"
              className="text-[#2A7477]/80 hover:text-[#30A3B0] transition-colors text-sm font-medium tracking-wide"
            >
              Services
            </Link>
            <Link
              href="/#contact"
              className="text-[#2A7477]/80 hover:text-[#30A3B0] transition-colors text-sm font-medium tracking-wide"
            >
              Contact
            </Link>
            <Button
              asChild
              className="bg-[#7CAE0A] hover:bg-[#7CAE0A]/90 text-white border-0 h-10 px-6 font-medium shadow-md"
            >
              <Link href="/bookings">Book Appointment</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#28436C] hover:bg-[#F5F1E8] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-[#F5F1E8]">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#28436C] hover:text-[#30A3B0] transition-colors font-medium py-2 text-lg"
              >
                Home
              </Link>
              <Link
                href="/#about"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#28436C] hover:text-[#30A3B0] transition-colors font-medium py-2 text-lg"
              >
                About
              </Link>
              <Link
                href="/#services"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#28436C] hover:text-[#30A3B0] transition-colors font-medium py-2 text-lg"
              >
                Services
              </Link>
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#28436C] hover:text-[#30A3B0] transition-colors font-medium py-2 text-lg"
              >
                Contact
              </Link>
              <Button
                asChild
                className="bg-[#7CAE0A] hover:bg-[#7CAE0A]/90 text-white w-full mt-2 h-12 font-medium shadow-md"
              >
                <Link href="/bookings" onClick={() => setIsMenuOpen(false)}>
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#2A7477] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-3xl font-light">The Melbourne Counsellor</h3>
            <p className="text-white/80 leading-relaxed">
              Professional counselling services with a welcoming, empathic approach and profound respect for diversity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[#C0C944]">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/#about" className="text-white/80 hover:text-white transition-colors">
                About Dan
              </Link>
              <Link href="/#services" className="text-white/80 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/bookings" className="text-white/80 hover:text-white transition-colors">
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[#C0C944]">Contact</h4>
            <div className="space-y-3">
              <a
                href="tel:0467477786"
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-[#30A3B0] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <span>0467 477 786</span>
              </a>
              <a
                href="mailto:dan@themelbournecounsellor.com.au"
                className="flex items-start gap-3 text-white/80 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-[#7CAE0A] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="break-all pt-2">dan@themelbournecounsellor.com.au</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-3 text-sm text-white/70 max-w-4xl mx-auto">
            <p>© 2025 The Melbourne Counsellor. All rights reserved.</p>
            <p>The Melbourne Counsellor Pty. Ltd. atf The Melbourne Counsellor Trust.</p>
            <p className="leading-relaxed">
              The Melbourne Counsellor acknowledges the Wurundjeri people who are the Traditional Custodians of the land
              on which we work. We pay our respects to Elders past, present and emerging.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
