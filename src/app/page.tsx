'use client'

import { useEffect, useState, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Play, Scissors, Film, Palette, Mail, CheckCircle,
  Youtube, X, ChevronRight, ArrowUp, Loader2,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getCertificates, type Certificate } from '@/sanity/queries/certificates'
import { getThumbnails, type Thumbnail } from '@/sanity/queries/thumbnails'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// --- Types ---

interface Video {
  id: string
  title: string
  description: string | null
  youtubeId: string
  category: 'long' | 'short'
  thumbnail: string | null
}

interface Client {
  id: string
  name: string
  description: string | null
  logo: string | null
}

export default function Home() {
  // --- State ---
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [activeThumbnail, setActiveThumbnail] = useState<Thumbnail | null>(null)

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(false)

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // --- Embla Carousel (REELS) ---
  const autoplayReels = Autoplay({
    delay: 2500,
    stopOnInteraction: false,
    stopOnMouseEnter: true
  })

  const [emblaRefReels, emblaApiReels] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      dragFree: false
    },
    [autoplayReels]
  )

  const [selectedIndexReels, setSelectedIndexReels] = useState(0)

  useEffect(() => {
    if (!emblaApiReels) return
    const onSelect = () => setSelectedIndexReels(emblaApiReels.selectedScrollSnap())
    emblaApiReels.on('select', onSelect)
    onSelect()
    return () => { emblaApiReels.off('select', onSelect) }
  }, [emblaApiReels])

  // --- Embla Carousel (CLIENTS) ---
  const [emblaRefClients, emblaApiClients] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true
  })

  const [selectedIndexClients, setSelectedIndexClients] = useState(0)

  useEffect(() => {
    if (!emblaApiClients) return
    const onSelect = () => setSelectedIndexClients(emblaApiClients.selectedScrollSnap())
    emblaApiClients.on('select', onSelect)
    onSelect()
    return () => { emblaApiClients.off('select', onSelect) }
  }, [emblaApiClients])

  // --- Effects ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certs, videosRes, clientsRes, thumbs] = await Promise.allSettled([
          getCertificates(),
          fetch('/api/videos'),
          fetch('/api/clients'),
          getThumbnails()
        ])

        if (certs.status === 'fulfilled') setCertificates(certs.value)
        if (videosRes.status === 'fulfilled' && videosRes.value.ok) {
          const data = await videosRes.value.json()
          setVideos(data)
        }
        if (clientsRes.status === 'fulfilled' && clientsRes.value.ok) {
          const data = await clientsRes.value.json()
          setClients(data)
        }
        if (thumbs.status === 'fulfilled') setThumbnails(thumbs.value)
      } catch (error) {
        console.error('Failed to load portfolio data:', error)
      }
    }
    fetchData()

    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(!entry.isIntersecting),
      { rootMargin: '0px', threshold: 0.0 }
    )
    const currentSentinel = sentinelRef.current
    if (currentSentinel) observer.observe(currentSentinel)
    return () => { if (currentSentinel) observer.unobserve(currentSentinel) }
  }, [])

  // --- Handlers ---
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      })
      if (res.ok) {
        setFormStatus('success')
        setContactForm({ name: '', email: '', message: '' })
        setTimeout(() => setFormStatus('idle'), 5000)
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      setFormStatus('error')
      console.error('Failed to send contact form:', error)
    }
  }

  const longVideos = videos.filter(v => v.category === 'long')
  const shortVideos = videos.filter(v => v.category === 'short')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div ref={sentinelRef} className="absolute top-0 left-0 w-px h-px" aria-hidden="true" />

      {/* Hero Section */}
<section className="relative overflow-hidden min-h-screen flex items-center px-6 md:px-10 lg:px-20 py-20">

  {/* BACKGROUND */}
  <div className="absolute inset-0 z-0">

    {/* Main Background Image */}
    <Image
      src="/h.jpg"
      alt="Hero Background"
      fill
      priority
      quality={90}
      className="object-cover scale-105"
    />

    {/* Dark Base */}
    <div className="absolute inset-0 bg-black/70" />

    {/* Cyan Atmospheric Lighting */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.18),transparent_35%)]" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,229,255,0.12),transparent_30%)]" />

    {/* Cinematic Vignette */}
    <div className="absolute inset-0 bg-black/40 [mask-image:radial-gradient(circle,transparent_35%,black)]" />

    {/* Noise Texture */}
    <div className="absolute inset-0 opacity-[0.03] mix-blend-screen bg-[url('/noise.png')]" />


    {/* Extra Glow Layer */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00E5FF]/10 rounded-full blur-3xl" />

  </div>

  {/* Back To Top */}
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className={`fixed top-1/2 right-4 md:right-8 z-50 p-3 rounded-full bg-[#00E5FF] text-black shadow-[0_0_30px_rgba(0,229,255,0.45)] transition-all duration-300 ${
      showBackToTop
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }`}
    aria-label="Back to top"
  >
    <ArrowUp className="w-5 h-5" />
  </button>

  {/* CONTENT */}
  <div className="relative z-10 max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT SIDE */}
    <div className="space-y-8 text-center lg:text-left">

      {/* Small Label */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5 backdrop-blur-md shadow-[0_0_25px_rgba(0,229,255,0.08)]">

        <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />

        <span className="text-sm tracking-[0.25em] uppercase text-[#00E5FF] font-medium">
          Cinematic Editor
        </span>

      </div>

      {/* Heading */}
      <div className="space-y-5">

        <h1 className="leading-none tracking-tight">

          {/* TEBOHO */}
          <span className="block text-white font-['Batman_Forever'] text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]">

            TEBOHO

          </span>

          {/* EDITS */}
          <span className="block italic font-black text-[#00E5FF] text-4xl sm:text-5xl md:text-7xl tracking-[0.18em] drop-shadow-[0_0_30px_rgba(0,229,255,0.45)]">

            EDITS

          </span>

        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-2xl text-white/80 font-light tracking-wide">

          Video Editor • Motion Designer • Visual Storyteller

        </p>

        {/* Description */}
        <p className="max-w-lg text-sm sm:text-base md:text-lg text-white/55 leading-relaxed mx-auto lg:mx-0">

          Transforming visuals into cinematic experiences through high-retention editing,
          motion graphics, and modern storytelling crafted for creators and brands.

        </p>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">

        {/* Primary Button */}
        <Button
          asChild
          size="lg"
          className="rounded-2xl bg-[#00E5FF] hover:bg-[#00cfe6] text-black font-bold px-8 shadow-[0_0_40px_rgba(0,229,255,0.45)] transition-all duration-300 hover:scale-[1.03]"
        >
          <Link href="#long-form">

            View My Work

          </Link>
        </Button>

        {/* Secondary Button */}
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-2xl border border-[#00E5FF]/30 bg-white/5 backdrop-blur-xl text-[#00E5FF] hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]/60 px-8 transition-all duration-300"
        >
          <Link href="#contact">

            Get In Touch

          </Link>
        </Button>

      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-10 pt-8">

        <div>
          <p className="text-3xl font-bold text-[#00E5FF]">50+</p>
          <p className="text-sm text-white/50">Projects Edited</p>
        </div>

        <div>
          <p className="text-3xl font-bold text-[#00E5FF]">3D</p>
          <p className="text-sm text-white/50">Motion Graphics</p>
        </div>

        <div>
          <p className="text-3xl font-bold text-[#00E5FF]">24/7</p>
          <p className="text-sm text-white/50">Creative Vision</p>
        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="relative hidden lg:flex items-center justify-center">

      {/* Main Glow */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-[#00E5FF]/15 blur-3xl" />

      {/* Floating Card */}
      <div className="relative w-[430px] h-[430px] rounded-[3rem] border border-[#00E5FF]/20 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.18)]">

        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 via-transparent to-transparent" />

        {/* Corner Accent */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l border-t border-[#00E5FF]/30 rounded-tl-2xl" />

        <div className="absolute bottom-6 right-6 w-16 h-16 border-r border-b border-[#00E5FF]/30 rounded-br-2xl" />

        {/* Floating Logo */}
        <div className="absolute inset-0 flex items-center justify-center">

          <Image
            src="/logo.png"
            alt="Teboho Edits Logo"
            width={320}
            height={320}
            className="object-contain drop-shadow-[0_0_35px_rgba(0,229,255,0.45)]"
          />

        </div>

      </div>

    </div>

  </div>

</section>

      {/* Skills & Tools Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#00E5FF]/5">
        <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Skills & Expertise</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">
              Mastering the art of visual storytelling with professional tools and techniques
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all hover:shadow-lg hover:shadow-[#00E5FF]/10">
              <CardHeader className="pb-3"><Scissors className="w-8 h-8 md:w-12 md:h-12 text-[#00E5FF] mb-2" /><CardTitle className="text-sm md:text-lg">Editing Software</CardTitle><CardDescription className="text-xs md:text-sm">Industry-standard tools for professional results</CardDescription></CardHeader>
              <CardContent><div className="flex flex-wrap gap-1 md:gap-2"><Badge className="text-[10px] md:text-xs bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20">Filmora</Badge><Badge className="text-[10px] md:text-xs bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20">CapCut</Badge><Badge className="text-[10px] md:text-xs bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20">DaVinci Resolve</Badge></div></CardContent>
            </Card>
            <Card className="border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all hover:shadow-lg hover:shadow-[#00E5FF]/10">
              <CardHeader className="pb-3"><Film className="w-8 h-8 md:w-12 md:h-12 text-[#00E5FF] mb-2" /><CardTitle className="text-sm md:text-lg">Specializations</CardTitle><CardDescription className="text-xs md:text-sm">Expertise in diverse editing styles</CardDescription></CardHeader>
              <CardContent><ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground"><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#00E5FF]" />Narrative-driven editing</li><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#00E5FF]" />Color grading</li><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#00E5FF]" />Motion graphics</li><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#00E5FF]" />Sound design</li></ul></CardContent>
            </Card>
            <Card className="border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all hover:shadow-lg hover:shadow-[#00E5FF]/10 md:col-span-1 col-span-2">
              <CardHeader className="pb-3"><Palette className="w-8 h-8 md:w-12 md:h-12 text-[#00E5FF] mb-2" /><CardTitle className="text-sm md:text-lg">My Approach</CardTitle><CardDescription className="text-xs md:text-sm">Where creativity meets precision</CardDescription></CardHeader>
              <CardContent><p className="text-xs md:text-sm text-muted-foreground leading-relaxed">I'm a video editor who loves the craft — the timing, the rhythm, the emotion behind every cut. I use AI tools to speed things up where it makes sense, but I always stay hands-on with the creative process. For me, it's about using tech to support the art, not replace it.</p></CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />
      <Separator className="bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />
      <Separator className="bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

      {/* Long Form Section */}
      <section id="long-form" className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-[#00E5FF]/5 to-transparent">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
          <div className="text-center space-y-3 md:space-y-4"><h2 className="text-3xl md:text-5xl font-bold font-['Batman_Forever'] text-[#00E5FF]">Long Form</h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">Full-length, horizontal videos showcasing cinematic storytelling</p></div>
          {longVideos.length === 0 ? (
            <Card className="text-center py-10 md:py-12"><CardContent><Youtube className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" /><p className="text-sm md:text-base text-muted-foreground">No long-form videos yet. Check back soon!</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {longVideos.map((video) => (
                <div key={video.id} className="w-0 min-w-full">
                  <VideoCard video={video} onPlay={() => { setIsVideoLoading(true); setSelectedVideo(video); }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

      {/* Reels Section */}
      <section id="reels" className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
          <div className="text-center space-y-3 md:space-y-4"><h2 className="text-3xl md:text-5xl font-bold font-['Batman_Forever'] text-[#00E5FF]">Reels</h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">Short-form, vertical content optimized for social media</p></div>
          {shortVideos.length === 0 ? (
            <Card className="text-center py-10 md:py-12"><CardContent><Youtube className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" /><p className="text-sm md:text-base text-muted-foreground">No reels yet. Check back soon!</p></CardContent></Card>
          ) : (
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRefReels}>
                <div className="flex gap-4 md:gap-6">
                  <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true" />
                  {shortVideos.map((video) => (
                    <div key={video.id} className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] flex-shrink-0">
                      <VideoCard video={video} onPlay={() => { setIsVideoLoading(true); setSelectedVideo(video); }} />
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-4 md:w-6" aria-hidden="true" />
                </div>
              </div>
              <button onClick={() => emblaApiReels && emblaApiReels.scrollPrev()} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10">‹</button>
              <button onClick={() => emblaApiReels && emblaApiReels.scrollNext()} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10">›</button>
              <div className="flex justify-center mt-4 gap-2">
                {shortVideos.map((_, index) => (
                  <button key={index} onClick={() => emblaApiReels && emblaApiReels.scrollTo(index)} className={`w-2 h-2 rounded-full ${index === selectedIndexReels ? "bg-[#00E5FF]" : "bg-gray-400"}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
          <div className="text-center space-y-3 md:space-y-4"><h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Services Offered</h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">Comprehensive video production services tailored to your needs</p></div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[{
              icon: Scissors, title: 'Video Editing', desc: 'Professional cuts and transitions'
            }, {
              icon: Film, title: 'Social Media Management', desc: 'Content strategy, posting & growth optimization'
            }, {
              icon: Youtube, title: 'Video Marketing', desc: 'YouTube & short-form growth strategies'
            }, {
              icon: ImageIcon,
              title: 'Thumbnail Design',
              desc: 'Eye‑catching, click‑driven YouTube & social media thumbnails'
            }].map((service, i) => (
              <Card key={i} className="text-center border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all hover:shadow-lg hover:shadow-[#00E5FF]/10">
                <CardContent className="pt-4 md:pt-6 space-y-2 md:space-y-3">
                  <service.icon className="w-6 h-6 md:w-10 md:h-10 mx-auto text-[#00E5FF]" />
                  <h3 className="text-sm md:text-base font-semibold font-['Arial']">{service.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-['Arial'] leading-snug">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#00E5FF]/5">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">
            <div className="text-center space-y-3 md:space-y-4"><h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Certifications</h2><p className="text-sm md:text-base text-muted-foreground font-['Arial']">Verified skills backed by formal training</p></div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
              {certificates.map((cert) => (
                <Card key={cert._id} onClick={() => setActiveCertificate(cert)} className="cursor-pointer border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all hover:shadow-lg hover:shadow-[#00E5FF]/10">
                  <CardContent className="pt-4 md:pt-6 space-y-3 md:space-y-4">
                    <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-md border border-[#00E5FF]/20 overflow-hidden">
                      <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1"><h3 className="text-sm md:text-lg font-semibold font-['Arial']">{cert.title}</h3>{cert.issuer && <p className="text-xs md:text-sm text-muted-foreground font-['Arial']">Issued by {cert.issuer}</p>}</div>
                    <Badge className="text-[10px] md:text-xs bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20">Certified</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Separator className="bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

      {/* Clients Section */}
      {clients.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#00E5FF]/5">
          <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-3 md:space-y-4"><h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Clients I've Worked With</h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">Proud to have collaborated with these amazing creators and brands</p></div>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRefClients}>
                <div className="flex gap-6 md:gap-8">
                  {clients.map((client) => (
                    <div key={client.id} className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] flex flex-col items-center text-center space-y-3 md:space-y-4">
                      <div className="relative"><div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#00E5FF]/30 bg-card">{client.logo ? <img src={client.logo} alt={client.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#00E5FF] to-[#00B3CC] flex items-center justify-center text-black font-bold font-['Arial'] text-lg md:text-2xl">{client.name.charAt(0)}</div>}</div></div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground font-['Arial']">{client.name}</h3>
                      {client.description && <p className="text-xs md:text-sm text-muted-foreground font-['Arial'] max-w-[140px] sm:max-w-xs">{client.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => emblaApiClients && emblaApiClients.scrollPrev()} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10">‹</button>
              <button onClick={() => emblaApiClients && emblaApiClients.scrollNext()} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10">›</button>
              <div className="flex justify-center mt-4 gap-2">
                {clients.map((_, index) => (
                  <button key={index} onClick={() => emblaApiClients && emblaApiClients.scrollTo(index)} className={`w-2 h-2 rounded-full ${index === selectedIndexClients ? "bg-[#00E5FF]" : "bg-gray-400"}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Separator className="bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

      {/* Thumbnails Section */}
      {thumbnails.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#00E5FF]/5">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
            <div className="text-center space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Thumbnail Portfolio</h2>
              <p className="text-sm md:text-base text-muted-foreground font-['Arial']">Click‑worthy designs that make your content stand out</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {thumbnails.map((thumb) => (
                <Card key={thumb._id} onClick={() => setActiveThumbnail(thumb)} className="cursor-pointer border-[#00E5FF]/20 hover:border-[#00E5FF]/50 transition-all hover:shadow-lg hover:shadow-[#00E5FF]/10 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-video">
                      <img src={thumb.imageUrl} alt={thumb.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  </CardContent>
                  {thumb.title && (
                    <div className="p-3">
                      <h3 className="text-sm font-semibold line-clamp-1">{thumb.title}</h3>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4"><h2 className="text-3xl md:text-4xl font-bold font-['Arial']">Let's Work Together</h2><p className="text-muted-foreground font-['Arial']">Ready to bring your vision to life? Get in touch and let's create something amazing.</p></div>
          <Card className="border-[#00E5FF]/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-[#00E5FF]" />Send Me a Message</CardTitle><CardDescription>Or email me directly at <a href="mailto:tebohoentene@gmail.com" className="text-[#00E5FF] hover:text-[#00B3CC]">tebohoentene@gmail.com</a></CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2"><label htmlFor="name" className="text-sm font-medium font-['Arial']">Name</label><Input id="name" placeholder="Your name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required /></div>
                <div className="space-y-2"><label htmlFor="email" className="text-sm font-medium font-['Arial']">Email</label><Input id="email" type="email" placeholder="your@email.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required /></div>
                <div className="space-y-2"><label htmlFor="message" className="text-sm font-medium font-['Arial']">Message</label><Textarea id="message" placeholder="Tell me about your project..." rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required /></div>
                <Button type="submit" className="w-full bg-[#00E5FF] hover:bg-[#00B3CC] text-black font-['Arial'] font-bold" disabled={formStatus === 'loading'}>{formStatus === 'loading' ? 'Sending...' : 'Send Message'}</Button>
                {formStatus === 'success' && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">Message sent successfully! I'll get back to you soon.</div>}
                {formStatus === 'error' && <div className="p-4 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-lg text-[#00E5FF] text-sm">Failed to send message. Please try again or email me directly.</div>}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 md:px-8 lg:px-16 border-t border-[#00E5FF]/20">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex justify-center relative w-16 h-16 mx-auto">
            <Image src="/logo.png" alt="Teboho Edits" fill className="object-contain" />
          </div>
          <p className="text-sm text-muted-foreground font-['Arial']">© {new Date().getFullYear()} Teboho Edits. All rights reserved.</p>
          <p className="text-xs text-muted-foreground font-['Arial']">Creative Video Editor | Visual Storyteller</p>
        </div>
      </footer>

      {/* Certificate Preview Dialog */}
      <Dialog
        open={!!activeCertificate}
        onOpenChange={(open) => {
          if (!open) setActiveCertificate(null)
        }}
      >
        <DialogContent className="p-0 border-[#00E5FF]/20 bg-background overflow-hidden !w-[80vw] !h-[80vh] !max-w-none flex flex-col">
          {activeCertificate && (
            <>
              <div className="p-4 md:p-6 border-b border-[#00E5FF]/20 flex-shrink-0">
                <DialogHeader className="text-center">
                  <DialogTitle className="font-['Arial'] text-2xl md:text-3xl">
                    {activeCertificate.title}
                  </DialogTitle>
                  {activeCertificate.issuer && (
                    <DialogDescription className="font-['Arial'] text-base md:text-lg mt-2">
                      Issued by {activeCertificate.issuer}
                    </DialogDescription>
                  )}
                </DialogHeader>
              </div>
              <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeCertificate.imageUrl}
                  alt={activeCertificate.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Thumbnail Preview Dialog */}
      <Dialog
        open={!!activeThumbnail}
        onOpenChange={(open) => {
          if (!open) setActiveThumbnail(null)
        }}
      >
        <DialogContent className="p-0 border-[#00E5FF]/20 bg-background overflow-hidden !w-[80vw] !h-[80vh] !max-w-none flex flex-col">
          {activeThumbnail && (
            <>
              <div className="p-4 md:p-6 border-b border-[#00E5FF]/20 flex-shrink-0">
                <DialogHeader className="text-center">
                  <DialogTitle className="font-['Arial'] text-2xl md:text-3xl">
                    {activeThumbnail.title}
                  </DialogTitle>
                  {activeThumbnail.description && (
                    <DialogDescription className="font-['Arial'] text-base md:text-lg mt-2">
                      {activeThumbnail.description}
                    </DialogDescription>
                  )}
                </DialogHeader>
              </div>
              <div className="flex-1 overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={activeThumbnail.imageUrl}
                  alt={activeThumbnail.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog
        open={!!selectedVideo}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedVideo(null)
            setIsVideoLoading(false)
          }
        }}
      >
        <DialogContent
          className={`p-0 border-[#00E5FF]/20 bg-background overflow-hidden !max-w-none flex flex-col ${
            selectedVideo?.category === 'short'
              ? '!w-[90vw] sm:!w-[70vw] md:!w-[50vw] lg:!w-[40vw] !h-[90vh]'
              : '!w-[95vw] md:!w-[80vw] !h-[80vh]'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#00E5FF]/20 bg-[#00E5FF]/5 flex-shrink-0">
            <div className="flex-1">
              <DialogTitle className="text-foreground font-['Arial']">
                {selectedVideo?.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-['Arial']">
                {selectedVideo?.category === 'long'
                  ? 'Long Form'
                  : 'Short Form'} Video
              </DialogDescription>
            </div>
          
          </div>

          <div className="relative flex-1 bg-black overflow-hidden">
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                <Loader2 className="w-12 h-12 animate-spin text-[#00E5FF]" />
              </div>
            )}
            {selectedVideo && (
              selectedVideo.category === 'short' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="h-full aspect-[9/16]">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                      title={selectedVideo.title}
                      onLoad={() => setIsVideoLoading(false)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  onLoad={() => setIsVideoLoading(false)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            )}
          </div>

          {selectedVideo?.description && (
            <div className="p-4 border-t border-[#00E5FF]/20 flex-shrink-0">
              <p className="text-sm text-muted-foreground font-['Arial']">
                {selectedVideo.description}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-[#00E5FF] hover:text-[#00B3CC] font-semibold font-['Arial']"
              >
                View on YouTube
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VideoCard({ video, onPlay, variant = "default" }: { video: Video; onPlay: () => void; variant?: "default" | "reel" }) {
  const isReel = variant === "reel" || video.category === "short";
  return (
    <Card className="w-full min-w-0 overflow-hidden hover:border-[#00E5FF]/50 transition-all group cursor-pointer" onClick={onPlay}>
      <CardContent className="p-0">
        <div className={`w-full ${isReel ? "aspect-[9/16]" : "aspect-video"}`}>
          <div className="relative w-full h-full bg-muted">
            <img src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`; }} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-[#00E5FF] hover:bg-[#00B3CC] text-black rounded-full p-3 md:p-4 transition-colors"><Play className="w-6 h-6 md:w-8 md:h-8 fill-current" /></div>
            </div>
          </div>
        </div>
        <div className={`p-3 md:p-4 space-y-1 md:space-y-2 ${isReel ? "text-sm" : ""}`}>
          <h3 className="font-semibold line-clamp-2">{video.title}</h3>
          {!isReel && video.description && <p className="text-sm text-muted-foreground line-clamp-3">{video.description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}