import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import User from '../entity/User'
import config from '../config/config'

class AuthController {
  static login = async (request: Request, response: Response) => {
    try {
      // Check if email and password are set
      let { email, password } = request.body
      if (!(email && password)) {
        response.status(400).send('Email and password not set.')
        return
      }

      // Get user from database
      const userRepository = getRepository(User)
      let user: User
      try {
        user = await userRepository.findOneOrFail({ where: { email } })
      } catch (error) {
        response.status(401).send('User not found. ' + error)
        return
      }

      // Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        response.status(401).send("Password don't match.")
        return
      }

      // Sign JWT, valid for 1 hour
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: '1h' }
      )

      // Send the JWT token in the response
      return response.status(200).send({ token: token })
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  static changePassword = async (request: Request, response: Response) => {
    // Get ID from JWT
    const id = response.locals.jwtPayload.userId

    // Get parameters from the body
    const { oldPassword, newPassword } = request.body
    if (!(oldPassword && newPassword)) {
      response.status(400).send('Old password and new password not set.')
      return
    }

    // Get user from the database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      response.status(401).send('User not found. ' + error)
      return
    }

    // Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      response.status(401).send("Old password don't match.")
      return
    }

    // Validate de model (password lenght)
    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      response.status(400).send(errors)
      return
    }

    // Hash the new password and save
    user.hashPassword()

    try {
      await userRepository.save(user)
    } catch (error) {
      return response.status(409).send(error)
    }

    return response.status(200).send('Password successfully changed.')
  }
}
export default AuthController