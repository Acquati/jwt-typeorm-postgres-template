import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import User from '../entity/User'
import config from '../config/config'

export class CreateAdminUser1610077226596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User()
    user.email = config.adminEmail
    user.password = config.adminPassword
    user.hashPassword()
    user.role = 'ADMIN'
    const userRepository = getRepository(User)
    await userRepository.save(user)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
