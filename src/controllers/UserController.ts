import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate, isUUID } from 'class-validator'
import User from '../entity/User'

export default class UserController {
  static listAll = async (request: Request, response: Response) => {
    const userRepository = getRepository(User)

    try {
      const users = await userRepository.find({
        select: ['id', 'email', 'username', 'role', 'createDate', 'updateDate']
      })
      return response.status(200).send(users)
    } catch (error) {
      return response.status(404).json({ message: 'No user found. ' + error })
    }
  }

  static getOneById = async (request: Request, response: Response) => {
    const userRepository = getRepository(User)
    const id = request.params.id

    if (!isUUID(id)) {
      return response.status(400).json({ message: 'Invalid input syntax for UUID.' })
    }

    try {
      const user = await userRepository.findOneOrFail(
        id,
        {
          select: ['id', 'email', 'username', 'role', 'createDate', 'updateDate']
        }
      )
      return response.send(user)
    } catch (error) {
      return response.status(404).json({ message: 'No user found. ' + error })
    }
  }

  static createUser = async (request: Request, response: Response) => {
    const userRepository = getRepository(User)
    const { email, username, password, role } = request.body
    let user = new User()
    const date = new Date()
    user.email = email
    user.username = username
    user.password = password
    user.role = role
    user.createDate = date
    user.updateDate = date

    const errors = await validate(user)
    if (errors.length > 0) {
      return response.status(400).json(errors)
    }

    user.hashPassword()

    try {
      await userRepository.save(user)
    } catch (error) {
      return response.status(409).json({ message: 'Email or username already in use. ' + error })
    }

    return response.status(201).json({ message: 'User created successfully.' })
  }

  static editUser = async (request: Request, response: Response) => {
    const userRepository = getRepository(User)
    let user: User
    const id = request.params.id
    const { email, username, role } = request.body

    if (!isUUID(id)) {
      return response.status(400).json({ message: 'Invalid input syntax for UUID.' })
    }

    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      return response.status(404).json({ message: 'No user found. ' + error })
    }

    user.email = email
    user.username = username
    user.role = role
    user.updateDate = new Date()

    const errors = await validate(user)
    if (errors.length > 0) {
      return response.status(400).json(errors)
    }

    try {
      await userRepository.save(user)
    } catch (error) {
      return response.status(409).json({ message: 'Email or username already in use. ' + error })
    }

    return response.status(200).json({ message: 'User edited successfully.' })
  }

  static deleteUser = async (request: Request, response: Response) => {
    const userRepository = getRepository(User)
    const id = request.params.id

    if (!isUUID(id)) {
      return response.status(400).json({ message: 'Invalid input syntax for UUID.' })
    }

    try {
      await userRepository.findOneOrFail(id)
    } catch (error) {
      return response.status(404).json({ message: 'No user found. ' + error })
    }

    try {
      await userRepository.delete(id)
    } catch (error) {
      return response.status(400).json({ message: error })
    }

    return response.status(200).json({ message: 'User successfully deleted.' })
  }
}