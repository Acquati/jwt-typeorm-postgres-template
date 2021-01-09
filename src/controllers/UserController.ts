import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import User from '../entity/User'

class UserController {
  static listAll = async (request: Request, response: Response) => {
    // Get users from database
    const userRepository = getRepository(User)
    const users = await userRepository.find({
      // We dont want to send the passwords on response
      select: ['id', 'email', 'username', 'createDate', 'updateDate', 'role']
    })

    // Send the users object
    response.send(users)
  }

  static getOneById = async (request: Request, response: Response) => {
    // Get the ID from the url
    const id = request.params.id

    // Get the user from database
    const userRepository = getRepository(User)
    try {
      const user = await userRepository.findOneOrFail(
        id,
        {
          // We dont want to send the password on response
          select: ['id', 'email', 'username', 'createDate', 'updateDate', 'role']
        }
      )
      response.send(user)
    } catch (error) {
      response.status(404).send('User not found. ' + error)
    }
  }

  static newUser = async (request: Request, response: Response) => {
    // Get parameters from the body
    let { email, username, password, role } = request.body
    let user = new User()
    let date = new Date()
    user.email = email
    user.username = username
    user.password = password
    user.role = role
    user.createDate = date
    user.updateDate = date

    // Validade if the parameters are ok
    const errors = await validate(user)
    if (errors.length > 0) {
      response.status(400).send(errors)
      return
    }

    // Hash the password, to securely store on DB
    user.hashPassword()

    // Try to save. If fails, the email is already in use
    const userRepository = getRepository(User)
    try {
      await userRepository.save(user)
    } catch (error) {
      response.status(409).send('Email or username already in use. ' + error)
      return
    }

    // If all ok, send 201 response
    response.status(201).send('User created successfully.')
  }

  static editUser = async (request: Request, response: Response) => {
    // Get the ID from the url
    const id = request.params.id

    // Get values from the body
    const { email, username, role } = request.body

    // Try to find user on database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      // If not found, send a 404 response
      response.status(404).send('User not found. ' + error)
      return
    }

    // Validate the new values on model
    user.email = email
    user.username = username
    user.role = role
    user.updateDate = new Date()
    const errors = await validate(user)
    if (errors.length > 0) {
      response.status(400).send(errors)
      return
    }

    // Try to save. If fails, the email is already in use
    try {
      await userRepository.save(user)
    } catch (error) {
      response.status(409).send('Email or username already in use. ' + error)
      return
    }

    // After all send a 200 (OK) response
    response.status(200).send('User edited successfully.')
  }

  static deleteUser = async (request: Request, response: Response) => {
    // Get the ID from the url
    const id = request.params.id

    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      response.status(404).send('User not found. ' + error)
      return
    }
    userRepository.delete(id)

    // After all send a 200 (OK) response
    response.status(200).send('User successfully deleted.')
  }
}

export default UserController