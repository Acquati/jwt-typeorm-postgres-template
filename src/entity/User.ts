import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
import { Length, IsNotEmpty } from 'class-validator'
import bcrypt from 'bcryptjs'

@Entity('users')
@Unique(['email'])
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  @Length(5, 254)
  email: string

  @Column()
  @Length(8, 100)
  password: string

  @Column()
  @IsNotEmpty()
  role: string

  // @Column()
  // @CreateDateColumn()
  // createdAt: Date

  // @Column()
  // @UpdateDateColumn()
  // updatedAt: Date

  // @BeforeInsert()
  // @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    console.log(this.password)
    console.log(unencryptedPassword)
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }
}