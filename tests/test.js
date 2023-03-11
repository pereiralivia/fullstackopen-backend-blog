const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require('../utils/list_helper');

const emptyBlogsList = [];
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];
const listWithMoreThanOneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

test('dummy returns one', () => {
  const blogs = [];
  const result = dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = totalLikes(emptyBlogsList);
    expect(result).toBe(0);
  });

  test('of list with one blog is 5', () => {
    const result = totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of list with more than one blog is 36', () => {
    const result = totalLikes(listWithMoreThanOneBlog);
    expect(result).toBe(36);
  });
});

describe('favorite blogs', () => {
  const expected = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  };
  test('of list with more than one blog', () => {
    const result = favoriteBlog(listWithMoreThanOneBlog);
    expect(result).toEqual(expected);
  });
});

describe('author with most blogs', () => {
  const expected = {
    author: 'Robert C. Martin',
    blogs: 3,
  };

  test('of list with more than one blog', () => {
    const result = mostBlogs(listWithMoreThanOneBlog);
    expect(result).toEqual(expected);
  });
});

describe('author with most likes', () => {
  const expected = {
    author: "Edsger W. Dijkstra",
    likes: 17
  };

  test('of list with more than one blog', () => {
    const result = mostLikes(listWithMoreThanOneBlog);
    expect(result).toEqual(expected);
  });
});

