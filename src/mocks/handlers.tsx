import { rest } from 'msw';
import data from './data/posts.json';

export const handlers = [
  // GET /api/posts?page=1&limit=10&s=lorem&t=news
  rest.get('/api/posts', async (req, res, ctx) => {
    const page = +(req.url.searchParams.get('page') ?? '1');
    const limit = +(req.url.searchParams.get('limit') ?? '10');

    const search = req.url.searchParams.get('s');
    const type = req.url.searchParams.get('t');

    let filteredPosts = data.posts;

    // Filter by search
    if (search) {
      filteredPosts = filteredPosts.filter((post) => {
        return (
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Filter by type
    if (type) {
      filteredPosts = filteredPosts.filter((post) => {
        return post.type === type;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const totalPosts = filteredPosts.length;

    return res(
      ctx.status(200),
      ctx.json({
        page,
        limit,
        total: totalPosts,
        posts: paginatedPosts,
      })
    );
  }),
];
