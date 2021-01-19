import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config'

export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
  const token = <string>request.headers['token']
  let jwtPayload: any

  try {
    jwtPayload = jwt.verify(token, config.jwtSecret)
    response.locals.jwtPayload = jwtPayload
  } catch (error) {
    return response.status(401).json({ message: 'Unauthorized access. ' + error })
  }

  const { userId, email } = jwtPayload
  const newToken = jwt.sign(
    { userId, email },
    config.jwtSecret,
    { expiresIn: '1h' }
  )

  response.setHeader('token', newToken)

  next()
}