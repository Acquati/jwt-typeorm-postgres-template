import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import User from '../entity/User'
import config from '../config/config'

export default class AuthController {
  static login = async (request: Request, response: Response) => {
    const userRepository = getRepository(User)
    let user: User
    let { email, password } = request.body

    if (!(email && password)) {
      return response.status(400).json({ message: 'Email and password have not been set.' })
    }

    try {
      user = await userRepository.findOneOrFail({ where: { email } })
    } catch (error) {
      return response.status(401).json({ message: 'User not found. ' + error })
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return response.status(401).json({ message: "Password don't match." })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    )

    return response.status(200).json({ token: token })
  }

  static changePassword = async (request: Request, response: Response) => {
    const userRepository = getRepository(User)
    let user: User
    const id = response.locals.jwtPayload.userId
    const { oldPassword, newPassword } = request.body

    if (!(oldPassword && newPassword)) {
      return response.status(400).json({ message: 'Old password and new password not set.' })
    }

    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      return response.status(401).json({ message: 'No user found. ' + error })
    }

    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      return response.status(401).json({ message: 'The current password does not match the old password set.' })
    }

    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      return response.status(400).send(errors)
    }

    user.hashPassword()

    try {
      await userRepository.save(user)
    } catch (error) {
      return response.status(409).json({ message: error })
    }

    return response.status(200).json({ message: 'Password successfully changed.' })
  }
}