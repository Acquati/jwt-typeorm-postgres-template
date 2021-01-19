import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import User from '../entity/User'

export const checkRole = (roles: Array<string>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const userRepository = getRepository(User)
    let user: User
    const id = response.locals.jwtPayload.userId

    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      return response.status(401).json({ message: 'User not found. ' + error })
    }

    // Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) {
      next()
    } else {
      return response.status(401).json({ message: 'Unauthorized access.' })
    }
  }
}