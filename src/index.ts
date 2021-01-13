import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { app } from './app'

//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {
    app.listen(3000, () => {
      console.log('Server started on port 3000!')
    })
  })
  .catch(error => console.log(error))