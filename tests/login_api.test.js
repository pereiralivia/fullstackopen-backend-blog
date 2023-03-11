const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

describe('when user logs in', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);

    const newUser = new User({ username: 'root', passwordHash });

    await newUser.save();
  });

  test('it succeeds with status 200 when credentials are valid', async () => {
    const validCredentials = {
      username: 'root',
      password: 'password',
    };

    await api.post('/api/login').send(validCredentials).expect(200);
  });

  test('it fails with status 401 when username is invalid', async () => {
    const credentialsWithInvalidUsername = {
      username: 'invalidusername',
      password: 'password',
    };

    await api
      .post('/api/login')
      .send(credentialsWithInvalidUsername)
      .expect(401);
  });

  test('it fails with status 401 when password is invalid', async () => {
    const credentialsWithInvalidPassword = {
      username: 'root',
      password: 'invalidPassword',
    };

    await api
      .post('/api/login')
      .send(credentialsWithInvalidPassword)
      .expect(401);
  });
});

