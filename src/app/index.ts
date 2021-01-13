import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import routes from '../routes'

// Create a new express application instance
const app = express()

// Call midlewares
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

//Set all routes from routes folder
app.use('/', routes)

export { app }