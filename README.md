# JWT TypeORM Postgres Template

Steps to run this project for development:

```bash
# Clone the repository
git clone git@github.com:Acquati/jwt-typeorm-postgres-template.git

# Open directory
cd jwt-typeorm-postgres-template

# Up Postgres Docker container
docker-compose up

# Copy config file example
cp ./src/config/config.example.ts ./src/config/config.ts

# Install modules
yarn install

# Run this migration in the first time setup
yarn run migration:run

# Start the server
yarn start
```
