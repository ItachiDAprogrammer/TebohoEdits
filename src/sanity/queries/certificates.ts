import { client } from '@/sanity/lib/client'

export interface Certificate {
  _id: string
  title: string
  description?: string
  issuer?: string
  imageUrl: string
  issuedAt?: string
}

export async function getCertificates(): Promise<Certificate[]> {
  return await client.fetch(
    `*[_type == "certificate"] | order(issuedAt desc) {
      _id,
      title,
      description,
      issuer,
      issuedAt,
      "imageUrl": image.asset->url
    }`
  )
}
