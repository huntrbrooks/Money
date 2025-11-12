 "use client"
 
 import { useEffect, useState } from "react"
 import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react"
import { LogoMark } from "@/components/logo"
 
 type NavLink = { label: string; href: string }
type Config = {
  brand?: { name?: string; subtitle?: string; tagline?: string; logoUrl?: string }
   navigation?: NavLink[]
   contact?: { phone?: string; email?: string }
 }
 
 export function Navigation() {
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [cfg, setCfg] = useState<Config>({})
 
   useEffect(() => {
     fetch("/api/site-config")
       .then((r) => r.json())
       .then((d) => setCfg(d))
       .catch(() => {})
   }, [])
 
   const links = cfg.navigation ?? [
     { label: "Home", href: "/" },
     { label: "About", href: "/#about" },
     { label: "Services", href: "/#services" },
     { label: "Contact", href: "/#contact" },
   ]
 
   return (
     <nav className="bg-white/98 backdrop-blur-sm border-b border-[var(--secondary)] sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
           {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            {cfg.brand?.logoUrl ? (
              <img
                src={cfg.brand.logoUrl}
                alt={`${cfg.brand?.name ?? "Site"} logo`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <LogoMark className="h-8 w-8 text-[var(--primary)]" title={`${cfg.brand?.name ?? "Site"} logo`} />
            )}
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors font-medium">
                {cfg.brand?.name ?? "The Melbourne Counsellor"}
              </span>
              {cfg.brand?.subtitle && (
                <span className="text-xs md:text-sm text-[var(--primary)]/80">{cfg.brand.subtitle}</span>
              )}
            </div>
          </Link>
 
           {/* Desktop Navigation */}
           <div className="hidden lg:flex items-center gap-8">
             {links.map((l) => (
               <Link
                 key={l.href}
                 href={l.href}
                 className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors text-sm font-medium tracking-wide"
               >
                 {l.label}
               </Link>
             ))}
             <Button
               asChild
               className="bg-[var(--accent)] hover:opacity-90 text-white border-0 h-10 px-6 font-medium shadow-md"
             >
               <Link href="/bookings">Book Appointment</Link>
             </Button>
           </div>
 
           {/* Mobile Menu Button */}
           <button
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="lg:hidden p-2 text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-lg transition-colors"
             aria-label="Toggle menu"
           >
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
         </div>
 
         {/* Mobile Navigation */}
         {isMenuOpen && (
           <div className="lg:hidden py-6 border-t border-[var(--secondary)]">
             <div className="flex flex-col gap-4">
               {links.map((l) => (
                 <Link
                   key={l.href}
                   href={l.href}
                   onClick={() => setIsMenuOpen(false)}
                   className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium py-2 text-lg"
                 >
                   {l.label}
                 </Link>
               ))}
               <Button
                 asChild
                 className="bg-[var(--accent)] hover:opacity-90 text-white w-full mt-2 h-12 font-medium shadow-md"
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
   const [cfg, setCfg] = useState<Config>({})
   useEffect(() => {
     fetch("/api/site-config")
       .then((r) => r.json())
       .then((d) => setCfg(d))
       .catch(() => {})
   }, [])
   const links = (cfg.navigation ?? []).filter((l) => l.href !== "/bookings")
 
   return (
    <footer className="text-[var(--foreground)] bg-[var(--section-bg-1)]">
       {/* Main Footer */}
     <div className="container mx-auto px-6 md:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-4 max-w-6xl mx-auto">
           {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {cfg.brand?.logoUrl ? (
                <img
                  src={cfg.brand.logoUrl}
                  alt={`${cfg.brand?.name ?? "Site"} logo`}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <LogoMark className="h-10 w-10 text-[var(--primary)]" title={`${cfg.brand?.name ?? "Site"} logo`} />
              )}
              <h3 className="font-serif text-3xl font-light">{cfg.brand?.name ?? "The Melbourne Counsellor"}</h3>
            </div>
            <p className="text-[var(--primary)]/80 leading-relaxed">
              {cfg.brand?.tagline ??
                "Trauma‑informed counselling specialising in financial trauma and monetary psychotherapy. A safe, gender‑aware and inclusive space."}
            </p>
          </div>
 
           {/* Quick Links */}
           <div className="space-y-4">
             <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)]">Quick Links</h4>
             <div className="flex flex-col gap-3">
               {links.map((l) => (
                 <Link key={l.href} href={l.href} className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                   {l.label}
                 </Link>
               ))}
               <Link href="/bookings" className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                 Book Appointment
               </Link>
              <Link href="/privacy" className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors">
                Terms of Service
              </Link>
             </div>
           </div>
 
           {/* Contact */}
           <div className="space-y-4">
             <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)]">Contact</h4>
             <div className="space-y-3">
               {cfg.contact?.phone && (
                 <a
                  href={`tel:${cfg.contact.phone.replace(/\s+/g, "")}`}
                   className="flex items-center gap-3 text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors group"
                 >
                   <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Phone className="w-4 h-4 text-white" />
                   </div>
                   <span>{cfg.contact.phone}</span>
                 </a>
               )}
               {cfg.contact?.email && (
                 <a
                   href={`mailto:${cfg.contact.email}`}
                   className="flex items-start gap-3 text-[var(--primary)]/80 hover:text-[var(--primary)] transition-colors group"
                 >
                   <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                     <Mail className="w-4 h-4 text-white" />
                   </div>
                   <span className="break-all pt-2">{cfg.contact.email}</span>
                 </a>
               )}
             </div>

          {/* Social */}
          <div className="space-y-4">
           <h4 className="font-semibold text-sm uppercase tracking-[0.15em] text-[var(--accent)]">Follow Dan</h4>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition">
                <Facebook className="w-5 h-5 text-[var(--primary)]" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition">
                <Instagram className="w-5 h-5 text-[var(--primary)]" />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full border border-[var(--secondary)] hover:bg-[var(--secondary)] transition">
                <Linkedin className="w-5 h-5 text-[var(--primary)]" />
              </a>
            </div>
          </div>
           </div>
         </div>
       </div>
 
       {/* Bottom Bar */}
     <div className="border-t border-[var(--secondary)] bg-[var(--section-bg-3)]">
        <div className="container mx-auto px-6 md:px-8 py-8">
           <div className="text-center space-y-3 text-sm text-[var(--primary)]/70 max-w-4xl mx-auto">
             <p>© 2025 The Melbourne Counsellor. All rights reserved.</p>
             <p>The Melbourne Counsellor Pty. Ltd. atf The Melbourne Counsellor Trust.</p>
             <p className="leading-relaxed">
               The Melbourne Counsellor acknowledges the Wurundjeri people who are the Traditional Custodians of the land
               on which we work. We pay our respects to Elders past, present and emerging.
             </p>
            <p className="space-x-4">
              <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[var(--foreground)]">Terms of Service</Link>
            </p>
           </div>
         </div>
       </div>
     </footer>
   )
 }
