import { faker } from '@faker-js/faker';
import { factory, oneOf, primaryKey } from '@mswjs/data';

export const db = factory({
  user: {
    id: primaryKey(String),
    avatar: String,
    name: String,
    mail: String,
  },

  categories: {
    id: primaryKey(String),
    title: String,
    author: oneOf('user'),
    createdAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    updatedBy: oneOf('user'),
    updatedAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    threads: Array,
    totalThreads: Number,
    totalMessages: Number,
    parentId: String,
  },

  threads: {
    id: primaryKey(String),
    title: String,
    posts: Array,
    author: oneOf('user'),
    createdAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    updatedBy: oneOf('user'),
    updatedAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    totalViews: Number,
    totalReplies: Number,
    parentId: String,
  },

  posts: {
    id: primaryKey(String),
    content: String,
    option: Array,
    status: Array,
    author: oneOf('user'),
    createdAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    updatedBy: oneOf('user'),
    updatedAt: () =>
      faker.date.between('2023-01-01', '2023-04-30').toISOString(),
    parentId: String,
  },
});

export const createDb = () => {
  // create 5 users
  let users = [];
  for (let i = 0; i < 5; i++) {
    const user = db.user.create({
      id: `${faker.datatype.number()}`,
      avatar: faker.image.avatar(),
      name: faker.name.fullName(),
      mail: faker.internet.email(),
    });
    users.push(user);
  }

  // create 10 categories
  let categories = [];
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const category = db.categories.create({
      id: `${faker.datatype.number()}`,
      title: faker.name.jobTitle(),
      author: randomUser,
      updatedBy: randomUser,
      totalThreads: faker.datatype.number(1000),
      totalMessages: faker.datatype.number(1000),
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
      id: `${faker.datatype.number()}`,
      title: faker.lorem.sentence(),
      author: randomUser,
      updatedBy: randomUser,
      parentId: randomCategory.id,
      totalViews: faker.datatype.number(1000),
      totalReplies: faker.datatype.number(1000),
    });
    threads.push(thread);
  }

  // create 10 posts
  let posts = [];
  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomThread = threads[Math.floor(Math.random() * threads.length)];

    const post = db.posts.create({
      id: `${faker.datatype.number()}`,
      content: faker.lorem.paragraph(),
      author: randomUser,
      updatedBy: randomUser,
      parentId: randomThread.id,
    });
    posts.push(post);
  }
};

createDb();
