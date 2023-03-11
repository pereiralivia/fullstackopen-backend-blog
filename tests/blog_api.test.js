const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('../tests/helper');

let token;

const getToken = async () => {
  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'password' });

  token = response.body.token;
};

beforeEach(async () => {
  const user = await helper.createUser();
  await helper.createBlogs(user);
  await getToken();
});

describe('when getting blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` });
    expect(response.body).toHaveLength(2);
  });

  test('all blogs have a unique identifier property named id', async () => {
    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` });
    expect(response.body[0].id).toBeDefined();
  });
});

describe('when creating a new blog', () => {
  test('a valid blog can be created', async () => {
    const validBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    };

    await api
      .post('/api/blogs')
      .send(validBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.body).toHaveLength(helper.initialBlogsList.length + 1);
  });

  test('blog title is saved', async () => {
    const validBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    };

    const response = await api
      .post('/api/blogs')
      .send(validBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.title).toBe('Canonical string reduction');
  });

  test('when likes property is missing it returns the default value', async () => {
    const validBlogWithoutLikesProperty = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    const response = await api
      .post('/api/blogs')
      .send(validBlogWithoutLikesProperty)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test('fails with 400 if title is undefined', async () => {
    const validBlogWithoutTitleProperty = {
      title: '',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    await api
      .post('/api/blogs')
      .send(validBlogWithoutTitleProperty)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400);
  });

  test('fails with 400 if url is undefined', async () => {
    const validBlogWithoutUrlProperty = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: '',
    };

    await api
      .post('/api/blogs')
      .send(validBlogWithoutUrlProperty)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400);
  });
});

describe('when getting a specific blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` });
    const blogs = response.body;

    const blogToFind = blogs[0];

    await api
      .get(`/api/blogs/${blogToFind.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200);
  });

  test('fails with status code 404 if id is invalid', async () => {
    const invalidId = '6407ae992b3c64ab5fd53e4a';

    await api
      .get(`/api/blogs/${invalidId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(404);
  });
});

describe('when updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` });
    const blogs = response.body;

    const blogToUpdate = blogs[0];

    const newBlogData = {
      likes: 6,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlogData)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with status code 404 if id is invalid', async () => {
    const invalidId = '6407ae992b3c64ab5fd53e4a';

    await api
      .put(`/api/blogs/${invalidId}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(404);
  });
});

describe('when deleting a blog', () => {
  test('succeeds with status code 204', async () => {
    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` });

    const blogs = response.body;
    const blogToDelete = blogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
  });
});

