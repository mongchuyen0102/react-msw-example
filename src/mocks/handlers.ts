import { rest } from 'msw';
import { db } from './db';

export const handlers = [
  // GET /api/posts?page=1&limit=10&s=lorem
  rest.get('/api/posts', async (req, res, ctx) => {
    const page = +(req.url.searchParams.get('page') ?? '1');
    const limit = +(req.url.searchParams.get('limit') ?? '10');
    const s = req.url.searchParams.get('s') ?? '';

    // Tìm các posts có content chứa s
    const searchPosts = db.posts.findMany({
      where: {
        content: {
          contains: s,
        },
      },
    });

    // Tìm các threads có title chứa s
    const searchThreads = db.threads.findMany({
      where: {
        title: {
          contains: s,
        },
      },
    });

    // Lấy ra các posts có parentId là id của các threads tìm được
    const searchPostsByThreads = db.posts.findMany({
      where: {
        parentId: {
          in: searchThreads.map((thread) => thread.id),
        },
      },
    });

    // Gộp các posts tìm được thành 1 mảng
    const searchPostsResult = [...searchPosts, ...searchPostsByThreads];

    // Phân trang
    const totalPage = Math.ceil(searchPostsResult.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const posts = searchPostsResult.slice(startIndex, endIndex);

    // Lấy thông tin thread cho từng post
    posts.forEach((post: any) => {
      const thread = db.threads.findFirst({
        where: {
          id: {
            equals: post.parentId,
          },
        },
      });

      // Lấy thông tin category cho từng thread
      if (thread) {
        post.thread = thread;

        const category = db.categories.findFirst({
          where: {
            id: {
              equals: thread.parentId,
            },
          },
        });
        if (category) (thread as any).category = category;
      }
    });

    return res(
      ctx.status(200),
      ctx.json({
        page,
        totalPage,
        totalCount: searchPostsResult.length,
        posts,
      })
    );
  }),
];
