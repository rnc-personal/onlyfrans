import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.object({
      name: z.string(),
      avatar: z.string(),
      verified: z.boolean().optional(),
      username: z.string()
    }),
    publishedAt: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    likes: z.number().default(0),
    retweets: z.number().default(0),
    replies: z.number().default(0),
    isRetweet: z.boolean().default(false),
    originalPost: z.object({
      author: z.object({
        name: z.string(),
        username: z.string()
      }),
      content: z.string()
    }).optional()
  })
});

export const collections = {
  posts
}; 