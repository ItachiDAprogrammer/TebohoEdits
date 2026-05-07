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
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Play, Scissors, Film, Palette, Music, Mail, CheckCircle,
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
      <section className="relative overflow-hidden py-12 md:py-20 px-4 sm:px-6 md:px-8 lg:px-16 flex items-center justify-center min-h-[100dvh] md:min-h-[100vh]">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-bg.jpg" alt="Hero Background" fill priority className="object-cover" quality={85} />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black/40 to-primary/10" />
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed top-1/2 right-4 md:right-8 z-50 bg-[#E50914] text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
            showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        <div className="relative max-w-6xl mx-auto text-center space-y-4 md:space-y-6 z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 mx-auto relative">
            <Image src="/logo.png" alt="Teboho Edits Logo" fill className="object-contain" priority />
          </div>
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-tight md:whitespace-nowrap">
              <span className="text-white font-['Batman_Forever'] inline-block mr-2">TEBOHO</span>
              <span className="text-[#E50914] font-['Arial'] inline-block">EDITS</span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-foreground font-['Arial']">
              Video Editor • Social Media Manager • Visual Storyteller
            </p>
            <p className="max-w-xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-['Arial']">
              Transforming visuals into meaningful stories. Whether it's cinematic cuts, branded content,
              or dynamic reels — I bring ideas to life with rhythm and style.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto bg-[#E50914] hover:bg-[#C41110] text-white font-['Arial']">
              <Link href="#long-form">View My Work</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-['Arial']">
              <Link href="#contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills & Tools Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#E50914]/5">
        <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
          <div className="text-center space-y-3 md:space-y-4">
            <h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Skills & Expertise</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">
              Mastering the art of visual storytelling with professional tools and techniques
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10">
              <CardHeader className="pb-3"><Scissors className="w-8 h-8 md:w-12 md:h-12 text-[#E50914] mb-2" /><CardTitle className="text-sm md:text-lg">Editing Software</CardTitle><CardDescription className="text-xs md:text-sm">Industry-standard tools for professional results</CardDescription></CardHeader>
              <CardContent><div className="flex flex-wrap gap-1 md:gap-2"><Badge className="text-[10px] md:text-xs bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">Filmora</Badge><Badge className="text-[10px] md:text-xs bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">CapCut</Badge><Badge className="text-[10px] md:text-xs bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">DaVinci Resolve</Badge></div></CardContent>
            </Card>
            <Card className="border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10">
              <CardHeader className="pb-3"><Film className="w-8 h-8 md:w-12 md:h-12 text-[#E50914] mb-2" /><CardTitle className="text-sm md:text-lg">Specializations</CardTitle><CardDescription className="text-xs md:text-sm">Expertise in diverse editing styles</CardDescription></CardHeader>
              <CardContent><ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground"><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#E50914]" />Narrative-driven editing</li><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#E50914]" />Color grading</li><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#E50914]" />Motion graphics</li><li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#E50914]" />Sound design</li></ul></CardContent>
            </Card>
            <Card className="border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10 md:col-span-1 col-span-2">
              <CardHeader className="pb-3"><Palette className="w-8 h-8 md:w-12 md:h-12 text-[#E50914] mb-2" /><CardTitle className="text-sm md:text-lg">My Approach</CardTitle><CardDescription className="text-xs md:text-sm">Where creativity meets precision</CardDescription></CardHeader>
              <CardContent><p className="text-xs md:text-sm text-muted-foreground leading-relaxed">I'm a video editor who loves the craft — the timing, the rhythm, the emotion behind every cut. I use AI tools to speed things up where it makes sense, but I always stay hands-on with the creative process. For me, it's about using tech to support the art, not replace it.</p></CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />

      {/* Long Form Section */}
      <section id="long-form" className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-[#E50914]/5 to-transparent">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
          <div className="text-center space-y-3 md:space-y-4"><h2 className="text-3xl md:text-5xl font-bold font-['Batman_Forever'] text-[#E50914]">Long Form</h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">Full-length, horizontal videos showcasing cinematic storytelling</p></div>
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

      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />

      {/* Reels Section with spacer elements */}
      <section id="reels" className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
          <div className="text-center space-y-3 md:space-y-4"><h2 className="text-3xl md:text-5xl font-bold font-['Batman_Forever'] text-[#E50914]">Reels</h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">Short-form, vertical content optimized for social media</p></div>
          {shortVideos.length === 0 ? (
            <Card className="text-center py-10 md:py-12"><CardContent><Youtube className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" /><p className="text-sm md:text-base text-muted-foreground">No reels yet. Check back soon!</p></CardContent></Card>
          ) : (
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRefReels}>
                <div className="flex gap-4 md:gap-6">
                  {/* Permanent spacer prevents edge touching */}
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
                  <button key={index} onClick={() => emblaApiReels && emblaApiReels.scrollTo(index)} className={`w-2 h-2 rounded-full ${index === selectedIndexReels ? "bg-[#E50914]" : "bg-gray-400"}`} />
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
              <Card key={i} className="text-center border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10">
                <CardContent className="pt-4 md:pt-6 space-y-2 md:space-y-3">
                  <service.icon className="w-6 h-6 md:w-10 md:h-10 mx-auto text-[#E50914]" />
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
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#E50914]/5">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">
            <div className="text-center space-y-3 md:space-y-4"><h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Certifications</h2><p className="text-sm md:text-base text-muted-foreground font-['Arial']">Verified skills backed by formal training</p></div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
              {certificates.map((cert) => (
                <Card key={cert._id} onClick={() => setActiveCertificate(cert)} className="cursor-pointer border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10">
                  <CardContent className="pt-4 md:pt-6 space-y-3 md:space-y-4">
                    <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-md border border-[#E50914]/20 overflow-hidden">
                      <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1"><h3 className="text-sm md:text-lg font-semibold font-['Arial']">{cert.title}</h3>{cert.issuer && <p className="text-xs md:text-sm text-muted-foreground font-['Arial']">Issued by {cert.issuer}</p>}</div>
                    <Badge className="text-[10px] md:text-xs bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">Certified</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />

      {/* Clients Section */}
      {clients.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#E50914]/5">
          <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-3 md:space-y-4"><h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Clients I've Worked With</h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-['Arial']">Proud to have collaborated with these amazing creators and brands</p></div>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRefClients}>
                <div className="flex gap-6 md:gap-8">
                  {clients.map((client) => (
                    <div key={client.id} className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] flex flex-col items-center text-center space-y-3 md:space-y-4">
                      <div className="relative"><div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#E50914]/30 bg-card">{client.logo ? <img src={client.logo} alt={client.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-[#E50914] to-[#C41110] flex items-center justify-center text-white font-bold font-['Arial'] text-lg md:text-2xl">{client.name.charAt(0)}</div>}</div></div>
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
                  <button key={index} onClick={() => emblaApiClients && emblaApiClients.scrollTo(index)} className={`w-2 h-2 rounded-full ${index === selectedIndexClients ? "bg-[#E50914]" : "bg-gray-400"}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />

      {/* Thumbnails Section */}
      {thumbnails.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#E50914]/5">
          <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
            <div className="text-center space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold font-['Arial']">Thumbnail Portfolio</h2>
              <p className="text-sm md:text-base text-muted-foreground font-['Arial']">Click‑worthy designs that make your content stand out</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {thumbnails.map((thumb) => (
                <Card key={thumb._id} onClick={() => setActiveThumbnail(thumb)} className="cursor-pointer border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10 overflow-hidden">
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
          <Card className="border-[#E50914]/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-[#E50914]" />Send Me a Message</CardTitle><CardDescription>Or email me directly at <a href="mailto:tebohoentene@gmail.com" className="text-[#E50914] hover:text-[#C41110]">tebohoentene@gmail.com</a></CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2"><label htmlFor="name" className="text-sm font-medium font-['Arial']">Name</label><Input id="name" placeholder="Your name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required /></div>
                <div className="space-y-2"><label htmlFor="email" className="text-sm font-medium font-['Arial']">Email</label><Input id="email" type="email" placeholder="your@email.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required /></div>
                <div className="space-y-2"><label htmlFor="message" className="text-sm font-medium font-['Arial']">Message</label><Textarea id="message" placeholder="Tell me about your project..." rows={5} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required /></div>
                <Button type="submit" className="w-full bg-[#E50914] hover:bg-[#C41110] text-white font-['Arial']" disabled={formStatus === 'loading'}>{formStatus === 'loading' ? 'Sending...' : 'Send Message'}</Button>
                {formStatus === 'success' && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">Message sent successfully! I'll get back to you soon.</div>}
                {formStatus === 'error' && <div className="p-4 bg-[#E50914]/10 border border-[#E50914]/20 rounded-lg text-[#E50914] text-sm">Failed to send message. Please try again or email me directly.</div>}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 md:px-8 lg:px-16 border-t border-[#E50914]/20">
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
  <DialogContent className="p-0 border-[#E50914]/20 bg-background overflow-hidden !w-[80vw] !h-[80vh] !max-w-none flex flex-col">

    {activeCertificate && (
      <>
        <div className="p-4 md:p-6 border-b border-[#E50914]/20 flex-shrink-0">
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
  <DialogContent className="p-0 border-[#E50914]/20 bg-background overflow-hidden !w-[80vw] !h-[80vh] !max-w-none flex flex-col">

    {activeThumbnail && (
      <>
        <div className="p-4 md:p-6 border-b border-[#E50914]/20 flex-shrink-0">
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
    className={`p-0 border-[#E50914]/20 bg-background overflow-hidden !max-w-none flex flex-col ${
      selectedVideo?.category === 'short'
        ? '!w-[40vw] !h-[90vh]'
        : '!w-[80vw] !h-[80vh]'
    }`}
  >

    <div className="flex items-center justify-between p-4 border-b border-[#E50914]/20 bg-[#E50914]/5 flex-shrink-0">

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

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedVideo(null)
          setIsVideoLoading(false)
        }}
        className="text-foreground hover:text-[#E50914]"
      >
        <X className="w-6 h-6" />
      </Button>

    </div>

    <div className="relative flex-1 bg-black overflow-hidden">

      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <Loader2 className="w-12 h-12 animate-spin text-[#E50914]" />
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
      <div className="p-4 border-t border-[#E50914]/20 flex-shrink-0">
        <p className="text-sm text-muted-foreground font-['Arial']">
          {selectedVideo.description}
        </p>

        <a
          href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-sm text-[#E50914] hover:text-[#C41110] font-semibold font-['Arial']"
        >
          View on YouTube
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    )}

  </DialogContent>
</Dialog>

      {/* Thumbnail Preview Dialog – large with clickable border */}
      <Dialog open={!!activeThumbnail} onOpenChange={(open) => !open && setActiveThumbnail(null)}>
        <DialogContent className="!p-0 !w-[75vw] !h-[75vh] !max-w-none bg-background border-[#E50914]/20 overflow-hidden flex flex-col">
          {activeThumbnail && (
            <div className="flex-1 flex flex-col items-center p-6 md:p-10">
              <DialogHeader className="text-center flex-shrink-0">
                <DialogTitle className="font-['Arial'] text-2xl md:text-3xl">{activeThumbnail.title}</DialogTitle>
                {activeThumbnail.description && <DialogDescription className="font-['Arial'] text-base md:text-lg mt-3">{activeThumbnail.description}</DialogDescription>}
              </DialogHeader>
              <div className="flex-1 w-full flex items-center justify-center min-h-0">
                <div className="relative w-full max-w-7xl aspect-video max-h-[80vh]">
                  <img src={activeThumbnail.imageUrl} alt={activeThumbnail.title} className="w-full h-full object-contain rounded-md" />
                </div>
              </div>
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
    <Card className="w-full min-w-0 overflow-hidden hover:border-[#E50914]/50 transition-all group cursor-pointer" onClick={onPlay}>
      <CardContent className="p-0">
        <div className={`w-full ${isReel ? "aspect-[9/16]" : "aspect-video"}`}>
          <div className="relative w-full h-full bg-muted">
            <img src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`; }} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-[#E50914] hover:bg-[#C41110] text-white rounded-full p-3 md:p-4 transition-colors"><Play className="w-6 h-6 md:w-8 md:h-8 fill-current" /></div>
            </div>
          </div>
        </div>
        <div className={`p-3 md:p-4 space-y-1 md:space-y-2 ${isReel ? "text-sm" : ""}`}>
          <h3 className="font-semibold line-clamp-2">{video.title}</h3>
          {!isReel && video.description && <p className="text-sm text-muted-foreground line-clamp-3">{video.description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}