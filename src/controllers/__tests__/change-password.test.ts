import connection from '../../utils/connection'
import supertest from 'supertest'
import { app } from '../../app'
import config from '../../config/config'

describe('Change Password Test Suite', () => {
  beforeAll(async () => {
    await connection.create()
  })

  afterAll(async () => {
    await connection.close()
  })

  beforeEach(async () => {
    await connection.clear()
    await connection.createTestAdmin()
  })

  test('Old password and new password not set.', async (done) => {
    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(user.status).toBe(200)

    const response = await supertest(app)
      .patch('/auth/change-password')
      .set({ token: user.body.token })
      .send()
    expect(response.status).toBe(400)

    done()
  })
})