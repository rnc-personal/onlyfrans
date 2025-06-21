import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = (page - 1) * limit;

    // Get all posts and sort by published date
    const allPosts = await getCollection('posts');
    const sortedPosts = allPosts.sort((a, b) => 
      new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
    );

    // Get posts for current page
    const posts = sortedPosts.slice(offset, offset + limit);
    const hasMore = offset + limit < sortedPosts.length;

    return new Response(JSON.stringify({
      posts: posts.map(post => ({
        id: post.id,
        slug: post.slug,
        body: post.body,
        data: post.data
      })),
      hasMore,
      total: sortedPosts.length,
      currentPage: page
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 