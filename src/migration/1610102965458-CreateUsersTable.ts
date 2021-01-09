import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUsersTable1610102965458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },
        {
          name: 'email',
          type: 'varchar',
          length: '254',
          isUnique: true
        },
        {
          name: 'username',
          type: 'varchar',
          length: '30',
          isUnique: true
        },
        {
          name: 'password',
          type: 'varchar',
          length: '60'
        },
        {
          name: 'role',
          type: 'varchar',
          length: '300'
        },
        {
          name: 'createDate',
          type: 'timestamp'
        },
        {
          name: 'updateDate',
          type: 'timestamp'
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
    await queryRunner.query('DROP EXTENSION "uuid-ossp"')
  }
}
