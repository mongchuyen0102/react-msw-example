import { rest } from 'msw';
import { db } from './db';

export const handlers = [
  // GET /api/posts?page=1&limit=10&s=lorem&t=news
  rest.get('/api/posts', async (req, res, ctx) => {
    const page = +(req.url.searchParams.get('page') ?? '1');
    const limit = +(req.url.searchParams.get('limit') ?? '10');
    // const search = req.url.searchParams.get('search') ?? '';

    const total = 10;

    // Lấy toàn bộ posts
    const posts = db.posts.getAll();

    return res(
      ctx.status(200),
      ctx.json({
        page,
        totalPage: Math.ceil(total / limit),
        totalCount: total,
        posts,
      })
    );
  }),
];
