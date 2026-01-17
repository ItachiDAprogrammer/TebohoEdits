'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Play, Scissors, Film, Palette, Music, Mail, CheckCircle, Youtube, X, ChevronRight, ArrowUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getCertificates, type Certificate } from '@/sanity/queries/certificates'
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
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [videos, setVideos] = useState<Video[]>([])
  const [clients, setClients] = useState<Client[]>([])
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  
  // Intersection Observer for Scroll
  const [showBackToTop, setShowBackToTop] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // --- Effects ---

  useEffect(() => {
    // 1. Fetch Data in Parallel
    const fetchData = async () => {
      try {
        const [certs, videosRes, clientsRes] = await Promise.allSettled([
          getCertificates(),
          fetch('/api/videos'),
          fetch('/api/clients')
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
      } catch (error) {
        console.error('Failed to load portfolio data:', error)
      }
    }

    fetchData()

    // 2. Intersection Observer for "Back to Top" Button
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBackToTop(!entry.isIntersecting)
      },
      { rootMargin: '0px', threshold: 0.0 }
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
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
      {/* Sentinal Element for Scroll Observer */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-px h-px" aria-hidden="true" />

      {/* Hero Section */}
      <section className="h-screen min-h-[700px] relative overflow-hidden py-20 px-4 md:px-8 lg:px-16 flex items-center justify-center">
        {/* Optimized Hero Background (Local Image) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed top-1/2 right-8 z-50 bg-[#E50914] text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        <div className="relative max-w-7xl mx-auto text-center space-y-6 z-10">
          {/* Logo (Local Image) */}
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
            <Image
              src="/logo.png"
              alt="Teboho Edits Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
              <span className="text-white font-['Batman_Forever']">TEBOHO</span>
              <span className="text-[#E50914] font-['Arial']"> EDITS</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground font-['Arial']">
              Video Editor • Social Media Manager • Visual Storyteller
            </p>

            <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed font-['Arial']">
              Transforming visuals into meaningful stories. Whether it's cinematic cuts, branded content,
              or dynamic reels — I bring ideas to life with rhythm and style.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-[#E50914] hover:bg-[#C41110] text-white font-['Arial']">
              <Link href="#long-form">View My Work</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-['Arial']">
              <Link href="#contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills & Tools Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#E50914]/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-['Arial']">Skills & Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-['Arial']">
              Mastering the art of visual storytelling with professional tools and techniques
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10">
              <CardHeader>
                <Scissors className="w-12 h-12 text-[#E50914] mb-2" />
                <CardTitle>Editing Software</CardTitle>
                <CardDescription>Industry-standard tools for professional results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">Filmora</Badge>
                  <Badge variant="secondary" className="bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">CapCut</Badge>
                  <Badge variant="secondary" className="bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">DaVinci Resolve</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10">
              <CardHeader>
                <Film className="w-12 h-12 text-[#E50914] mb-2" />
                <CardTitle>Specializations</CardTitle>
                <CardDescription>Expertise in diverse editing styles</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E50914]" />
                    Narrative-driven editing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E50914]" />
                    Color grading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E50914]" />
                    Motion graphics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E50914]" />
                    Sound design
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#E50914]/20 hover:border-[#E50914]/50 transition-all hover:shadow-lg hover:shadow-[#E50914]/10">
              <CardHeader>
                <Palette className="w-12 h-12 text-[#E50914] mb-2" />
                <CardTitle>My Approach</CardTitle>
                <CardDescription>Where creativity meets precision</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I'm a video editor who loves the craft — the timing, the rhythm, the emotion behind every cut.
                  I use AI tools to speed things up where it makes sense, but I always stay hands-on with the
                  creative process. For me, it's about using tech to support the art, not replace it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
     
      {/* Certificates Section */}
      {certificates.length > 0 && (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#E50914]/5">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold font-['Arial']">
                Certifications
              </h2>
              <p className="text-muted-foreground font-['Arial']">
                Verified skills backed by formal training
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <Card
                  key={cert._id}
                  onClick={() => setActiveCertificate(cert)}
                  className="cursor-pointer hover:border-[#E50914]/50 transition-all"
                >
                  <CardContent className="pt-6 space-y-4">
                    {/* Standard img for Sanity External Images to bypass config */}
                    <div className="relative w-full h-48 rounded-md border border-[#E50914]/20 overflow-hidden">
                       <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold font-['Arial']">
                        {cert.title}
                      </h3>

                      {cert.issuer && (
                        <p className="text-sm text-muted-foreground font-['Arial']">
                          Issued by {cert.issuer}
                        </p>
                      )}
                    </div>

                    <Badge className="bg-[#E50914]/10 text-[#E50914] border-[#E50914]/20">
                      Certified
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-['Arial']">Services Offered</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-['Arial']">
              Comprehensive video production services tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
              { icon: Scissors, title: 'Video Editing', desc: 'Professional cuts and transitions' },
              { icon: Film, title: 'Social Media Management', desc: 'Content strategy, posting & growth optimization' },
              { icon: Palette, title: 'Color Grading', desc: 'Cinematic color enhancement' },
              { icon: Music, title: 'Sound Design', desc: 'Immersive audio experience' },
              { icon: Youtube, title: 'Video Marketing', desc: 'YouTube & short-form growth strategies' },
              { icon: CheckCircle, title: 'Web Design (Certified)', desc: 'Modern, responsive portfolio & landing pages' }
            ].map((service, i) => (
              <Card key={i} className="text-center hover:border-[#E50914]/50 transition-all">
                <CardContent className="pt-6 space-y-3">
                  <service.icon className="w-10 h-10 mx-auto text-[#E50914]" />
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.desc}</p> 
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />


      {/* Long Form Section */}
      <section id="long-form" className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#E50914]/5 to-transparent">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-['Batman_Forever'] text-[#E50914]">Long Form</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-['Arial']">
              Full-length, horizontal videos showcasing cinematic storytelling
            </p>
          </div>

          {longVideos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Youtube className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No long-form videos yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {longVideos.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={() => { setIsVideoLoading(true); setSelectedVideo(video) }} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />

      {/* Reels Section */}
      <section id="reels" className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-['Batman_Forever'] text-[#E50914]">Reels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-['Arial']">
              Short-form, vertical content optimized for social media
            </p>
          </div>

          {shortVideos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Youtube className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reels yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortVideos.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={() => { setIsVideoLoading(true); setSelectedVideo(video) }} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />

      {/* Clients Section */}
      {clients.length > 0 && (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-transparent to-[#E50914]/5">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold font-['Arial']">Clients I've Worked With</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-['Arial']">
                Proud to have collaborated with these amazing creators and brands
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {clients.map((client) => (
                <div key={client.id} className="flex flex-col items-center text-center space-y-4">
                  {/* Circular Profile Image */}
                  <div className="relative group">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#E50914]/30 bg-card">
                      {client.logo ? (
                        // Standard img for Sanity External Images
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#E50914] to-[#C41110] flex items-center justify-center text-white font-bold font-['Arial'] text-2xl md:text-3xl">
                          {client.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Name - Bold Heading */}
                  <h3 className="text-lg md:text-xl font-bold text-foreground font-['Arial']">
                    {client.name}
                  </h3>

                  {/* Short Description */}
                  {client.description && (
                    <p className="text-sm text-muted-foreground font-['Arial'] max-w-xs">
                      {client.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-['Arial']">Let's Work Together</h2>
            <p className="text-muted-foreground font-['Arial']">
              Ready to bring your vision to life? Get in touch and let's create something amazing.
            </p>
          </div>

          <Card className="border-[#E50914]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#E50914]" />
                Send Me a Message
              </CardTitle>
              <CardDescription>
                Or email me directly at{' '}
                <a href="mailto:tebohoentene@gmail.com" className="text-[#E50914] hover:text-[#C41110]">
                  tebohoentene@gmail.com
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium font-['Arial']">Name</label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium font-['Arial']">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium font-['Arial']">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-[#C41110] text-white font-['Arial']"
                  disabled={formStatus === 'loading'}
                >
                  {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </Button>

                {formStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="p-4 bg-[#E50914]/10 border border-[#E50914]/20 rounded-lg text-[#E50914] text-sm">
                    Failed to send message. Please try again or email me directly.
                  </div>
                )}
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
          <p className="text-sm text-muted-foreground font-['Arial']">
            © {new Date().getFullYear()} Teboho Edits. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-['Arial']">
            Creative Video Editor | Visual Storyteller
          </p>
        </div>
      </footer>

     {/* Certificate Preview Dialog */}
<Dialog
  open={!!activeCertificate}
  onOpenChange={(open) => !open && setActiveCertificate(null)}
>
  <DialogContent
    className="!w-[80vw] !max-w-none !h-[80vh] !max-h-none p-4 bg-background border-[#E50914]/20 overflow-auto rounded-md"
  >
    {activeCertificate && (
      <div className="space-y-4 flex flex-col items-center">
        <DialogHeader className="text-center">
          <DialogTitle className="font-['Arial'] text-xl md:text-2xl">
            {activeCertificate.title}
          </DialogTitle>
          {activeCertificate.issuer && (
            <DialogDescription className="font-['Arial'] text-sm md:text-base">
              Issued by {activeCertificate.issuer}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="relative w-full flex-1 max-h-[70vh]">
           {/* Standard img for Sanity External Images */}
           <img
              src={activeCertificate.imageUrl}
              alt={activeCertificate.title}
              className="w-full h-full object-contain rounded-md"
            />
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>


{/* Video Player Dialog */}
<Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
  <DialogContent
    className="
      !p-0 !max-w-[80vw] !max-h-[80vh] w-[80vw] h-[80vh] 
      sm:w-[95vw] sm:h-[95vh] 
      bg-background border-[#E50914]/20 overflow-hidden flex flex-col
    "
  >
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-[#E50914]/20 bg-[#E50914]/5">
      <div className="flex-1">
        <DialogTitle className="text-foreground font-['Arial']">{selectedVideo?.title}</DialogTitle>
        <DialogDescription className="text-muted-foreground font-['Arial']">
          {selectedVideo?.category === 'long' ? 'Long Form' : 'Short Form'} Video
        </DialogDescription>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSelectedVideo(null)}
        className="text-foreground hover:text-[#E50914]"
      >
        <X className="w-6 h-6" />
      </Button>
    </div>

    {/* Video Player */}
    <div className="flex-1 w-full bg-black relative">
      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <Loader2 className="w-12 h-12 animate-spin text-[#E50914]" />
        </div>
      )}

      {selectedVideo && (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
          title={selectedVideo.title}
          onLoad={() => setIsVideoLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>

    {/* Description */}
    {selectedVideo?.description && (
      <div className="p-4 border-t border-[#E50914]/20">
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

    </div>
  )
}

function VideoCard({ video, onPlay }: { video: Video; onPlay: () => void }) {
  return (
    <Card className="overflow-hidden hover:border-[#E50914]/50 transition-all group cursor-pointer" onClick={onPlay}>
      <CardContent className="p-0">
        <AspectRatio ratio={video.category === 'short' ? 9 / 16 : 16 / 9}>
          <div className="relative w-full h-full bg-muted">
            {/* Standard img for YouTube Thumbnails */}
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-[#E50914] hover:bg-[#C41110] text-white rounded-full p-4 transition-colors">
                <Play className="w-8 h-8 fill-current" />
              </div>
            </div>
          </div>
        </AspectRatio>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{video.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}