const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

const initialUsersList = [
  { username: 'root', passwordHash: '' },
  { username: 'user1', passwordHash: '' },
  { username: 'user2', passwordHash: '' },
];

describe('when getting users', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);

    const newUsers = initialUsersList.map(
      (u) => new User({ ...u, passwordHash })
    );

    const promisesArrays = newUsers.map((u) => u.save());
    await Promise.all(promisesArrays);
  });

  test('it succeeds with status 200 and returns json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('it returns users', async () => {
    const users = await api.get('/api/users');
    expect(users.body).toHaveLength(initialUsersList.length);
  });
});

describe('when creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('it succeeds with status 201 when user is valid', async () => {
    const usersAtStart = await User.find({});

    const validUser = {
      username: 'livia',
      name: 'Livia Pereira',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const userNames = usersAtEnd.map((u) => u.username);
    expect(userNames).toContain(validUser.username);
  });

  test('it fails with status 400 when username is not unique', async () => {
    const userWithNotUniqueUsername = {
      username: 'root',
      password: 'password',
    };

    await api.post('/api/users').send(userWithNotUniqueUsername).expect(400);
  });

  test('it fails with status 400 when username is invalid', async () => {
    const userWithInvalidUsername = {
      username: 'ro',
      password: 'password',
    };

    await api.post('/api/users').send(userWithInvalidUsername).expect(400);
  });

  test('it fails with status 400 when username is empty', async () => {
    const userWithoutUsername = {
      username: '',
      password: 'password',
    };

    await api.post('/api/users').send(userWithoutUsername).expect(400);
  });

  test('it fails with status 400 when password is invalid', async () => {
    const userWithInvalidPassword = {
      username: 'root',
      password: 'pa',
    };

    await api.post('/api/users').send(userWithInvalidPassword).expect(400);
  });
});

