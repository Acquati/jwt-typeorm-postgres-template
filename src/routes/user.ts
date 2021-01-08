import { Router } from 'express'
import UserController from '../controllers/UserController'
import { checkJwt } from '../middlewares/checkJwt'
import { checkRole } from '../middlewares/checkRole'

const router = Router()

//Get all users
router.get(
  '/',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.listAll
)

// Get one user
router.get(
  '/:id',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.getOneById
)

//Create a new user
router.post(
  '/',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.newUser
)

//Edit one user
router.patch(
  '/:id',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.editUser
)

//Delete one user
router.delete(
  '/:id',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.deleteUser
)

export default router