import { faker } from '@faker-js/faker';
import { factory, oneOf, primaryKey } from '@mswjs/data';

export const db = factory({
  user: {
    id: primaryKey(faker.datatype.number),
    avatar: faker.image.avatar,
    name: faker.name.fullName,
    mail: faker.internet.email,
  },

  categories: {
    id: primaryKey(faker.datatype.number),
    title: faker.name.jobTitle,
    author: oneOf('user'),
    createdAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    updatedBy: oneOf('user'),
    updatedAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    totalThreads: () => faker.datatype.number(1000),
    totalMessages: () => faker.datatype.number(1000),
    parentId: String,
  },

  threads: {
    id: primaryKey(faker.datatype.number),
    title: faker.lorem.sentence,
    author: oneOf('user'),
    createdAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    updatedBy: oneOf('user'),
    updatedAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    totalViews: () => faker.datatype.number(1000),
    totalReplies: () => faker.datatype.number(1000),
    parentId: Number,
    category: oneOf('categories'),
  },

  posts: {
    id: primaryKey(faker.datatype.number),
    content: faker.lorem.paragraph,
    option: Array,
    status: faker.datatype.boolean,
    author: oneOf('user'),
    createdAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    updatedBy: oneOf('user'),
    updatedAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    parentId: Number,
    thread: oneOf('threads'),
  },
});

export const createDb = () => {
  // create 5 users
  let users = [];
  for (let i = 0; i < 5; i++) {
    const user = db.user.create();
    users.push(user);
  }

  // create 10 categories
  let categories = [];
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const category = db.categories.create({
      author: randomUser,
      updatedBy: randomUser,
    });
    categories.push(category);
  }

  // create 10 threads
  let threads = [];
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    const thread = db.threads.create({
      author: randomUser,
      updatedBy: randomUser,
      parentId: randomCategory.id,
    });
    threads.push(thread);
  }

  // create 10 posts
  let posts = [];
  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomThread = threads[Math.floor(Math.random() * threads.length)];

    const post = db.posts.create({
      author: randomUser,
      updatedBy: randomUser,
      parentId: randomThread.id,
    });
    posts.push(post);
  }
};

createDb();
