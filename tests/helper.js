const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');

const initialBlogsList = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];

const createUser = async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('password', 10);
  const newUser = new User({ username: 'root', passwordHash });
  const user = await newUser.save();

  return user;
};

const createBlogs = async (user) => {
  await Blog.deleteMany({});
  const blogsObjects = initialBlogsList.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
  const promisesArray = blogsObjects.map((blog) => blog.save());
  await Promise.all(promisesArray);
};

module.exports = {
  initialBlogsList,
  createUser,
  createBlogs,
};

