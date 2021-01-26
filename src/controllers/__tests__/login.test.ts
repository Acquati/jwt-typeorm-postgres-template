import connection from '../../utils/connection'
import supertest from 'supertest'
import { app } from '../../app'
import config from '../../config/config'

describe('Login User Test Suite', () => {
  beforeAll(async () => {
    await connection.create()
  })

  afterAll(async () => {
    await connection.clear()
    await connection.close()
  })

  beforeEach(async () => {
    await connection.clear()
    await connection.createTestAdmin()
  })

  test('Email and password were not set.', async (done) => {
    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: '', password: '' })
    expect(user.status).toBe(400)

    done()
  })

  test('No user found with this email', async (done) => {
    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail + 'x', password: config.adminPassword })
    expect(user.status).toBe(404)

    done()
  })

  test('The password does not match.', async (done) => {
    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword + 'x' })
    expect(user.status).toBe(401)

    done()
  })

  test('The administrator can log in.', async (done) => {
    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(user.status).toBe(200)

    done()
  })
})