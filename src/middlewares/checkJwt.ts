import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config'

export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
  // Get the jwt token from the head
  const token = <string>request.headers['token']
  let jwtPayload: any

  // Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(token, config.jwtSecret)
    response.locals.jwtPayload = jwtPayload
  } catch (error) {
    // If token is not valid, respond with 401 (unauthorized)
    response.status(401).send('Unauthorized access. ' + error)
    return
  }

  // The token is valid for 1 hour
  // We want to send a new token on every request
  const { userId, email } = jwtPayload
  const newToken = jwt.sign({ userId, email }, config.jwtSecret, {
    expiresIn: '1h'
  })
  response.setHeader('token', newToken)

  // Call the next middleware or controller
  next()
}