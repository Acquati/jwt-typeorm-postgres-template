import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import connection from '../../utils/connection'
import { app } from '../../app'
import config from '../../config/config'

describe('Delete User Test Suite', () => {
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

  test('Delete user.', async (done) => {
    let jwtPayload: any

    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    const user = await supertest(app)
      .post('/user')
      .set({ token: adminAuth.body.token })
      .send({
        email: "test1@test.com",
        username: "test1",
        password: "12345678",
        role: "ADMIN"
      })
    expect(user.status).toBe(201)

    const userAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(userAuth.status).toBe(200)

    jwtPayload = jwt.verify(userAuth.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const response = await supertest(app)
      .delete('/user/' + userId)
      .set({ token: adminAuth.body.token })
      .send()
    expect(response.status).toBe(200)

    done()
  })
})