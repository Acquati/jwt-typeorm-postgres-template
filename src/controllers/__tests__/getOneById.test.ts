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
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    let jwtPayload: any = jwt.verify(adminAuth.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const response = await supertest(app)
      .get('/user/' + userId + 'x')
      .set({ token: adminAuth.body.token })
      .send()
    expect(response.status).toBe(400)

    done()
  })

  test('No user found.', async (done) => {
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    const createUser = await supertest(app)
      .post('/user')
      .set({ token: adminAuth.body.token })
      .send({
        email: 'test1@test.com',
        username: 'test1',
        password: '12345678',
        role: 'ADMIN'
      })
    expect(createUser.status).toBe(201)

    const userAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: 'test1@test.com', password: '12345678' })
    expect(userAuth.status).toBe(200)

    let jwtPayload: any = jwt.verify(userAuth.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const deleteUser = await supertest(app)
      .delete('/user/' + userId)
      .set({ token: adminAuth.body.token })
      .send()
    expect(deleteUser.status).toBe(200)

    const response = await supertest(app)
      .get('/user/' + userId)
      .set({ token: adminAuth.body.token })
      .send()
    expect(response.status).toBe(404)

    done()
  })

  test('The administrator can request user data.', async (done) => {
    const userAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(userAuth.status).toBe(200)

    let jwtPayload: any = jwt.verify(userAuth.body.token, config.jwtSecret)
    const { userId } = jwtPayload

    const response = await supertest(app)
      .get('/user/' + userId)
      .set({ token: userAuth.body.token })
      .send()
    expect(response.status).toBe(200)

    done()
  })
})