import { defineType, defineField } from 'sanity'

export const certificate = defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Certificate Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'issuer',
      title: 'Issued By',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Certificate Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'issuedAt',
      title: 'Date Issued',
      type: 'date',
    }),
  ],
})
