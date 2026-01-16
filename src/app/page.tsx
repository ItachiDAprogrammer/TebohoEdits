'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Play, Scissors, Film, Palette, Music, Mail, CheckCircle, Youtube, X, ChevronRight, ArrowUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  const [videos, setVideos] = useState<Video[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    fetchVideos()
    fetchClients()

    // Scroll handler
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowBackToTop(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos')
      if (res.ok) {
        const data = await res.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    }
  }

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

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
      {/* Hero Section - Full Height */}
      <section className="h-screen min-h-[700px] relative overflow-hidden py-20 px-4 md:px-8 lg:px-16 flex items-center justify-center" style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
            <img
              src="/logo.png"
              alt="Teboho Edits Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed top-8 right-8 z-50 bg-[#E50914] text-white p-3 rounded-full shadow-lg transition-all duration-500 ${
              showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          <div className="space-y-2">
            {/* Dual Styled Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
              <span className="text-white font-['Batman_Forever']">TEBOHO</span>
              <span className="text-[#E50914] font-['Arial']"> EDITS</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-['Arial']">
              Creative Video Editor | Visual Storyteller
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
              { icon: Palette, title: 'Color Grading', desc: 'Cinematic color enhancement' },
              { icon: Film, title: 'Motion Graphics', desc: 'Dynamic visual effects' },
              { icon: Music, title: 'Sound Design', desc: 'Immersive audio experience' }
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

      {/* Clients Section - Redesigned */}
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
          <div className="flex justify-center">
            <img src="/logo.png" alt="Teboho Edits" className="w-16 h-16 object-contain" />
          </div>
          <p className="text-sm text-muted-foreground font-['Arial']">
            © {new Date().getFullYear()} Teboho Edits. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-['Arial']">
            Creative Video Editor | Visual Storyteller
          </p>
        </div>
      </footer>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-[#E50914]/20">
          <div className="relative">
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
            <AspectRatio ratio={selectedVideo?.category === 'short' ? 9 / 16 : 16 / 9}>
  <div className="w-full h-full bg-black relative">
    {/* Loader */}
    {isVideoLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
        <Loader2 className="w-12 h-12 animate-spin text-[#E50914]" />
      </div>
    )}

    {/* IFRAME — ALWAYS RENDERED */}
    {selectedVideo && (
      <iframe
        className={`w-full h-full transition-opacity duration-300 ${
          isVideoLoading ? 'opacity-0' : 'opacity-100'
        }`}
        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
        title={selectedVideo.title}
        onLoad={() => setIsVideoLoading(false)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )}
  </div>
</AspectRatio>

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
          </div>
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
