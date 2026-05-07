import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'thumbnail',
  title: 'Thumbnail',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A short name for this thumbnail (e.g., video title)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Thumbnail Image',
      type: 'image',
      description: 'Upload the thumbnail image here',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description (optional)',
      type: 'text',
      description: 'Any notes about this design, the project, etc.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({ title, media }) {
      return { title, media }
    },
  },
})