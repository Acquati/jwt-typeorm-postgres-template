import supertest from 'supertest'
import connection from '../../utils/connection'
import { app } from '../../app'
import config from '../../config/config'

describe('Create User Test Suite', () => {
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

  test('The administrator can create a new user.', async (done) => {
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    const response = await supertest(app)
      .post('/user')
      .set({ token: adminAuth.body.token })
      .send({
        email: "test1@test.com",
        username: "test1",
        password: "12345678",
        role: "ADMIN"
      })
    expect(response.status).toBe(201)

    done()
  })
})