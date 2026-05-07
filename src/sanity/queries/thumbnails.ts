import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

export interface Thumbnail {
  _id: string
  title: string
  description?: string
  imageUrl: string
}

export async function getThumbnails(): Promise<Thumbnail[]> {
  const query = `*[_type == "thumbnail"] | order(_createdAt desc) {
    _id,
    title,
    description,
    "imageUrl": image.asset->url
  }`
  const thumbs = await client.fetch(query)
  return thumbs
}