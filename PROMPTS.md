create app and save promt in PROMPTS.md
Include:
PROMPTS.md – a record of your prompts and instructions to AI
README.md – with setup steps and example API calls

NestJs:
docker container run all service
db postgres port: 5435
nestJs port 4001
nextJs port 3003

create dir for backend with nestJs, prisma, postgresql , create Dockerfile (prisma migrate, generate)
connect db with docker
postgres db user : postgres
password : 1234
db name : book-management
url use docker ps name database

GET /books (List) and GET /books/:id (Detail)

CREATE, EDIT, DELETE (Soft delete)

Validation & Error Handling:

Implement robust data validation for all inputs (e.g., ISBN must be unique, required
fields must not be empty).

Handle all errors (e.g., resource not found, validation failure) using appropriate HTTP
Status Codes (e.g., 400 Bad Request, 404 Not Found).

Unit test coverage 100%

NextJs:

call api with docket nestJs

BookList - Display books in a grid/list
BookCard - Individual book display
BookForm - Add/Edit book form
SearchBar - Search functionality
BookStats - Display statistics
Requirements:
Use TypeScript interfaces
Implement proper props typing
Required Files:

Dockerfile.backend` - Multi-stage build for NestJS
Dockerfile.frontend` - Multi-stage build for Next.js
docker-compose.yml` - Multi-container setup
dockerignore` files for both services
nextJs and NestJs connect with docker

-----------------------------------

add gitignore and check build&run docker compose

--------------------------------

fix error code prisma version 6 to version 7 

--------------------------------

fix docker error 
=> ERROR [backend builder 6/7] RUN npx prisma generate    