import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import connection from '../../utils/connection'
import { app } from '../../app'
import config from '../../config/config'

describe('Get One User By Id Test Suite', () => {
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

  test('Invalid input syntax for UUID.', async (done) => {
    let jwtPayload: any

    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(user.status).toBe(200)

    jwtPayload = jwt.verify(user.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const response = await supertest(app)
      .get('/user/' + userId + 'x')
      .set({ token: user.body.token })
      .send()
    expect(response.status).toBe(400)

    done()
  })

  test('The administrator can request user data.', async (done) => {
    let jwtPayload: any

    const user = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(user.status).toBe(200)

    jwtPayload = jwt.verify(user.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const response = await supertest(app)
      .get('/user/' + userId)
      .set({ token: user.body.token })
      .send()
    expect(response.status).toBe(200)

    done()
  })
})