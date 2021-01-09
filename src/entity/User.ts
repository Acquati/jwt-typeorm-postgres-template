import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Length, IsNotEmpty, IsEmail, IsString } from 'class-validator'
import bcrypt from 'bcryptjs'

@Entity('users')
@Unique(['email', 'username'])
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 254)
  email: string

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  username: string

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(8, 60)
  password: string

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  role: string

  @CreateDateColumn()
  createDate: Date

  @UpdateDateColumn()
  updateDate: Date

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }
}