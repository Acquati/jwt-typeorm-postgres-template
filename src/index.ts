import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import routes from './routes'

//Connects to the Database -> then starts the express
createConnection()
  .then(
    async connection => {
      // Create a new express application instance
      const app = express()

      // Call midlewares
      app.use(cors())
      app.use(helmet())
      app.use(bodyParser.json())

      //Set all routes from routes folder
      app.use('/', routes)

      app.listen(3000, () => {
        console.log('Server started on port 3000!')
      })
    }
  )
  .catch(error => console.log(error))