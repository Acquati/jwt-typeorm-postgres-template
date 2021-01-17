import connection from '../../utils/connection'
import supertest from 'supertest'
import { app } from '../../app'
import config from '../../config/config'

describe('Login Test Suite', () => {
  beforeAll(async () => {
    await connection.create()
  })

  afterAll(async () => {
    await connection.close()
  })

  beforeEach(async () => {
    await connection.clear()
  })

  test('Login as admin user.', async (done) => {
    await connection.createTestAdmin()

    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })

    expect(user.status).toBe(200)
    done()
  })

  test('Email and password not set.', async (done) => {
    await connection.createTestAdmin()

    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: '', password: '' })

    expect(user.status).toBe(400)
    done()
  })

  test('User not found.', async (done) => {
    await connection.createTestAdmin()

    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail + 'x', password: config.adminPassword })

    expect(user.status).toBe(401)
    done()
  })

  test("Password don't match.", async (done) => {
    await connection.createTestAdmin()

    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword + 'x' })

    expect(user.status).toBe(401)
    done()
  })
})