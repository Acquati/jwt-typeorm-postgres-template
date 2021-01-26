import connection from '../../utils/connection'
import supertest from 'supertest'
import { app } from '../../app'
import config from '../../config/config'

describe('Change User Password Test Suite', () => {
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

  test('The old password and the new password have not been set.', async (done) => {
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    const response = await supertest(app)
      .patch('/auth/change-password')
      .set({ token: adminAuth.body.token })
      .send()
    expect(response.status).toBe(400)

    done()
  })

  test('The current password does not match the old password set.', async (done) => {
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    const response = await supertest(app)
      .patch('/auth/change-password')
      .set({ token: adminAuth.body.token })
      .send({ oldPassword: config.adminPassword + 'x', newPassword: config.adminPassword + 'x' })
    expect(response.status).toBe(401)

    done()
  })

  test('The authenticated user can change his password.', async (done) => {
    const adminAuth = await supertest(app)
      .post('/auth/login')
      .send({ email: config.adminEmail, password: config.adminPassword })
    expect(adminAuth.status).toBe(200)

    const response = await supertest(app)
      .patch('/auth/change-password')
      .set({ token: adminAuth.body.token })
      .send({ oldPassword: config.adminPassword, newPassword: config.adminPassword + 'x' })
    expect(response.status).toBe(200)

    done()
  })
})