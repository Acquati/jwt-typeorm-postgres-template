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
    await supertest(app)
      .post('/auth/change-password')
      .send({ oldPassword: '', newPassword: '' })
      .expect(400)
  })
})