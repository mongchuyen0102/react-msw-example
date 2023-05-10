import { rest } from 'msw';
import mockCategories from './data/categories.json';
import mockPosts from './data/posts.json';
import mockThreads from './data/threads.json';

export const handlers = [
  // GET /api/posts?page=1&limit=10&s=lorem
  rest.get('/api/posts', async (req, res, ctx) => {
    const page = +(req.url.searchParams.get('page') ?? '1');
    const limit = +(req.url.searchParams.get('limit') ?? '10');
    const s = req.url.searchParams.get('s') ?? '';

    // Tìm các posts có content chứa s
    const searchPosts = mockPosts.posts.filter((post) =>
      post.content.toLowerCase().includes(s.toLowerCase())
    );

    // Tìm các threads có title chứa s
    const searchThreads = mockThreads.threads.filter((thread) =>
      thread.title.toLowerCase().includes(s.toLowerCase())
    );
    // Lấy ra các posts có parentId là id của các threads tìm được
    const searchPostsByThreads = mockPosts.posts.filter((post) =>
      searchThreads.map((thread) => thread.id).includes(post.parentId)
    );

    // Gộp các posts tìm được thành 1 mảng
    const searchPostsResult = [...searchPosts, ...searchPostsByThreads];

    // Phân trang
    const totalPage = Math.ceil(searchPostsResult.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const posts = searchPostsResult.slice(startIndex, endIndex);

    // Lấy thông tin thread cho từng post
    posts.forEach((post: any) => {
      const thread = mockThreads.threads.find(
        (thread) => thread.id === post.parentId
      );
      post.thread = thread;

      // Lấy thông tin category cho từng thread
      if (thread) {
        const category = mockCategories.categories.find(
          (category) => category.id === thread.parentId
        );
        (thread as any).category = category;
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
