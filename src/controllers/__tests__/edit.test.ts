import supertest from 'supertest'
import connection from '../../utils/connection'
import jwt from 'jsonwebtoken'
import { app } from '../../app'
import config from '../../config/config'

describe('Edit User Test Suite', () => {
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

  test('The administrator can edit a user.', async (done) => {
    let jwtPayload: any
    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(user.status).toBe(200)

    jwtPayload = jwt.verify(user.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const response = await supertest(app)
      .patch('/user/' + userId)
      .set({ token: user.body.token })
      .send({
        email: 'test2@test.com',
        username: 'test2',
        role: 'ADMIN'
      })
    expect(response.status).toBe(200)

    done()
  })
})