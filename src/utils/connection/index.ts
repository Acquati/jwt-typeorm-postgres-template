import { createConnection, getConnection, getRepository } from 'typeorm'
import User from '../../entity/User'
import config from '../../config/config'

const connection = {
  async create() {
    await createConnection()
  },

  async close() {
    await getConnection().close()
  },

  async clear() {
    const connection = getConnection()
    const entities = connection.entityMetadatas

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name)
      await repository.delete(() => '')
    })
  },

  async createTestAdmin() {
    let user = new User()
    let date = new Date()

    user.email = config.adminEmail
    user.username = config.adminUsername
    user.password = config.adminPassword
    user.createDate = date
    user.updateDate = date
    user.hashPassword()
    user.role = 'ADMIN'

    const userRepository = getRepository(User)
    await userRepository.save(user)
  }
}

export default connection