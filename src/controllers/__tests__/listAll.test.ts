import supertest from 'supertest'
import jwt from 'jsonwebtoken'
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

  test('No user found.', async (done) => {
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    let jwtPayload: any = jwt.verify(adminAuth.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const deleteUser = await supertest(app)
      .delete('/user/' + userId)
      .set({ token: adminAuth.body.token })
      .send()
    expect(deleteUser.status).toBe(200)

    const response = await supertest(app)
      .get('/user')
      .set({ token: adminAuth.body.token })
      .send()
    expect(response.status).toBe(404)

    done()
  })

  test('The administrator can request all users data.', async (done) => {
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    const response = await supertest(app)
      .get('/user')
      .set({ token: adminAuth.body.token })
      .send()
    expect(response.status).toBe(200)

    done()
  })
})