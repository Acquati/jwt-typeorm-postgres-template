import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import User from '../entity/User'
import config from '../config/config'

export class CreateAdminUser1610102968947 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User()
    let date = new Date()
    user.email = config.adminEmail
    user.username = config.adminUsername
    user.password = config.adminPassword
    user.createDate = date
    user.updateDate = date
    user.hashPassword()
    user.role = 'ADMIN'
    const userRepository = getRepository(User, 'seed')
    await userRepository.save(user)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
