const middleware = require('../middleware');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) return response.status(404).end();
  response.json(blog);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user;

  const body = request.body;
  if (!body.title || !body.url) response.status(400).end();

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const createdBlog = await blog.save();

  user.blogs = [...user.blogs, createdBlog._id];
  await user.save();

  response.status(201).json(createdBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const blogExists = await Blog.findById(request.params.id);

  if (!blogExists) {
    return response.status(404).end();
  }

  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  response.json(updatedBlog);
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const userFromToken = request.user;

    if (!userFromToken) {
      return response.status(401).json({ error: 'invalid token' });
    }

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }

    const userFromBlogId = blog.user.toString();

    if (userFromToken.id !== userFromBlogId) {
      return response.status(401).json({ error: 'invalid token' });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  }
);

module.exports = blogsRouter;

