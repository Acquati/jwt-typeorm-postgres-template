import supertest from 'supertest'
import connection from '../../utils/connection'
import { app } from '../../app'
import config from '../../config/config'

describe('List All Users Test Suite', () => {
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

  test('List all users.', async (done) => {
    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(user.status).toBe(200)

    const response = await supertest(app)
      .get('/user')
      .set({ token: user.body.token })
      .send()
    expect(response.status).toBe(200)

    done()
  })
})