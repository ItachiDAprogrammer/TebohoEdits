'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2, Plus, Youtube, Users, AlertCircle, CheckCircle, Home, Edit2 } from 'lucide-react'
import Link from 'next/link'

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

export default function AdminPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [clients, setClients] = useState<Client[]>([])

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    youtubeId: '',
    category: 'long' as 'long' | 'short',
    thumbnail: ''
  })

  // Edit video state
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [editVideoForm, setEditVideoForm] = useState({
    id: '',
    title: '',
    description: '',
    youtubeId: '',
    category: 'long' as 'long' | 'short',
    thumbnail: ''
  })

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: '',
    description: '',
    logo: ''
  })

  const [videoStatus, setVideoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [clientStatus, setClientStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [editStatus, setEditStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    Promise.all([fetchVideos(), fetchClients()])
  }

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

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setVideoStatus('loading')

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoForm)
      })

      if (res.ok) {
        setVideoStatus('success')
        setVideoForm({
          title: '',
          description: '',
          youtubeId: '',
          category: 'long',
          thumbnail: ''
        })
        await fetchVideos()
        setTimeout(() => setVideoStatus('idle'), 3000)
      } else {
        setVideoStatus('error')
        setTimeout(() => setVideoStatus('idle'), 3000)
      }
    } catch (error) {
      setVideoStatus('error')
      console.error('Failed to add video:', error)
      setTimeout(() => setVideoStatus('idle'), 3000)
    }
  }

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditStatus('loading')

    try {
      const res = await fetch('/api/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editVideoForm)
      })

      if (res.ok) {
        setEditStatus('success')
        setEditingVideo(null)
        setEditVideoForm({
          id: '',
          title: '',
          description: '',
          youtubeId: '',
          category: 'long',
          thumbnail: ''
        })
        await fetchVideos()
        setTimeout(() => setEditStatus('idle'), 3000)
      } else {
        setEditStatus('error')
        setTimeout(() => setEditStatus('idle'), 3000)
      }
    } catch (error) {
      setEditStatus('error')
      console.error('Failed to update video:', error)
      setTimeout(() => setEditStatus('idle'), 3000)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await fetchVideos()
      }
    } catch (error) {
      console.error('Failed to delete video:', error)
    }
  }

  const openEditDialog = (video: Video) => {
    setEditingVideo(video)
    setEditVideoForm({
      id: video.id,
      title: video.title,
      description: video.description || '',
      youtubeId: video.youtubeId,
      category: video.category,
      thumbnail: video.thumbnail || ''
    })
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setClientStatus('loading')

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientForm)
      })

      if (res.ok) {
        setClientStatus('success')
        setClientForm({
          name: '',
          description: '',
          logo: ''
        })
        await fetchClients()
        setTimeout(() => setClientStatus('idle'), 3000)
      } else {
        setClientStatus('error')
        setTimeout(() => setClientStatus('idle'), 3000)
      }
    } catch (error) {
      setClientStatus('error')
      console.error('Failed to add client:', error)
      setTimeout(() => setClientStatus('idle'), 3000)
    }
  }

  const handleDeleteClient = async (id: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await fetchClients()
      }
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-[#E50914]/20 bg-gradient-to-r from-[#E50914]/10 to-[#E50914]/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-['Arial']">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1 font-['Arial']">Manage your portfolio content</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="videos">
              <Youtube className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <Card className="border-[#E50914]/20">
              <CardHeader>
                <CardTitle>Add New Video</CardTitle>
                <CardDescription>Add a video to your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Video title"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtubeId">YouTube Video ID *</Label>
                      <Input
                        id="youtubeId"
                        placeholder="e.g., dQw4w9WgXcQ"
                        value={videoForm.youtubeId}
                        onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        The ID from a YouTube URL: youtube.com/watch?v=<strong>ID</strong>
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        value={videoForm.category}
                        onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as 'long' | 'short' })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="long">Long (Horizontal, YouTube-style)</option>
                        <option value="short">Short (Vertical, Reels/Shorts)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
                      <Input
                        id="thumbnail"
                        placeholder="Custom thumbnail URL"
                        value={videoForm.thumbnail}
                        onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Video description..."
                      rows={3}
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#E50914] hover:bg-[#C41110] text-white"
                    disabled={videoStatus === 'loading'}
                  >
                    {videoStatus === 'loading' ? 'Adding...' : 'Add Video'}
                  </Button>

                  {videoStatus === 'success' && (
                    <Alert className="border-green-500/20 bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-400">
                        Video added successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  {videoStatus === 'error' && (
                    <Alert className="border-[#E50914]/20 bg-[#E50914]/10">
                      <AlertCircle className="h-4 w-4 text-[#E50914]" />
                      <AlertDescription className="text-[#E50914]">
                        Failed to add video. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-['Arial']">Manage Videos ({videos.length})</h2>
              {videos.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Youtube className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No videos added yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-muted">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${
                            video.category === 'long'
                              ? 'bg-[#E50914]'
                              : 'bg-[#E50914]'
                          }`}
                        >
                          {video.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{video.youtubeId}</p>
                        <div className="flex gap-2">
                          <Dialog open={editingVideo?.id === video.id} onOpenChange={(open) => !open && setEditingVideo(null)}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 text-[#E50914]" onClick={() => openEditDialog(video)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Video</DialogTitle>
                                <DialogDescription>
                                  Update video details
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleUpdateVideo} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="editTitle">Title *</Label>
                                  <Input
                                    id="editTitle"
                                    value={editVideoForm.title}
                                    onChange={(e) => setEditVideoForm({ ...editVideoForm, title: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editYoutubeId">YouTube Video ID *</Label>
                                  <Input
                                    id="editYoutubeId"
                                    value={editVideoForm.youtubeId}
                                    onChange={(e) => setEditVideoForm({ ...editVideoForm, youtubeId: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editCategory">Category *</Label>
                                  <select
                                    id="editCategory"
                                    value={editVideoForm.category}
                                    onChange={(e) => setEditVideoForm({ ...editVideoForm, category: e.target.value as 'long' | 'short' })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                  >
                                    <option value="long">Long (Horizontal, YouTube-style)</option>
                                    <option value="short">Short (Vertical, Reels/Shorts)</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editThumbnail">Thumbnail URL (Optional)</Label>
                                  <Input
                                    id="editThumbnail"
                                    value={editVideoForm.thumbnail}
                                    onChange={(e) => setEditVideoForm({ ...editVideoForm, thumbnail: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="editDescription">Description</Label>
                                  <Textarea
                                    id="editDescription"
                                    rows={3}
                                    value={editVideoForm.description}
                                    onChange={(e) => setEditVideoForm({ ...editVideoForm, description: e.target.value })}
                                  />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    type="submit"
                                    className="flex-1 bg-[#E50914] hover:bg-[#C41110] text-white"
                                    disabled={editStatus === 'loading'}
                                  >
                                    {editStatus === 'loading' ? 'Saving...' : 'Save Changes'}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingVideo(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                                {editStatus === 'success' && (
                                  <Alert className="border-green-500/20 bg-green-500/10">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <AlertDescription className="text-green-400">
                                      Video updated successfully!
                                    </AlertDescription>
                                  </Alert>
                                )}
                                {editStatus === 'error' && (
                                  <Alert className="border-[#E50914]/20 bg-[#E50914]/10">
                                    <AlertCircle className="h-4 w-4 text-[#E50914]" />
                                    <AlertDescription className="text-[#E50914]">
                                      Failed to update video. Please try again.
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </form>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="flex-1">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Video?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{video.title}" from your portfolio. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteVideo(video.id)}
                                  className="bg-[#E50914] hover:bg-[#C41110]"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="border-[#E50914]/20">
              <CardHeader>
                <CardTitle>Add New Client</CardTitle>
                <CardDescription>Add a client or brand you've worked with</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddClient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client/Brand Name *</Label>
                    <Input
                      id="clientName"
                      placeholder="Client or brand name"
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientLogo">Logo URL (Optional)</Label>
                    <Input
                      id="clientLogo"
                      placeholder="Logo image URL"
                      value={clientForm.logo}
                      onChange={(e) => setClientForm({ ...clientForm, logo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientDescription">Description</Label>
                    <Textarea
                      id="clientDescription"
                      placeholder="Brief description about client..."
                      rows={3}
                      value={clientForm.description}
                      onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#E50914] hover:bg-[#C41110] text-white"
                    disabled={clientStatus === 'loading'}
                  >
                    {clientStatus === 'loading' ? 'Adding...' : 'Add Client'}
                  </Button>

                  {clientStatus === 'success' && (
                    <Alert className="border-green-500/20 bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-400">
                        Client added successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  {clientStatus === 'error' && (
                    <Alert className="border-[#E50914]/20 bg-[#E50914]/10">
                      <AlertCircle className="h-4 w-4 text-[#E50914]" />
                      <AlertDescription className="text-[#E50914]">
                        Failed to add client. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-['Arial']">Manage Clients ({clients.length})</h2>
              {clients.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No clients added yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((client) => (
                    <Card key={client.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          {client.logo ? (
                            <img
                              src={client.logo}
                              alt={client.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E50914] to-[#C41110] flex items-center justify-center text-white font-bold font-['Arial']">
                              {client.name.charAt(0)}
                            </div>
                          )}
                          {client.name}
                        </CardTitle>
                      </CardHeader>
                      {client.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {client.description}
                          </p>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="w-full">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Client?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{client.name}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="bg-[#E50914] hover:bg-[#C41110]"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
