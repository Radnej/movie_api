# movie api

## Project description

This is the server side of a movie app. The app provides users with access to information about different movies, directors, and genres.
Users are able to sign up and login, update their personal information, and create a list of their favorite movies.
The REST API and database are built using Node.js, Express, and MongoDB. The business logic is modeled with Mongoose.
The endpoints of the API can be accessed with HTTP methods (POST, GET, PUT, and DELETE) to Create, Read, Update, and Delete (CRUD) data from the database.

## Demo
To see a documentation of the endpoints open [this link](https://my-flix-220508.herokuapp.com/documentation.html) 

## Built With

- Node.js
- Express
- MongoDB

## Dependencies

- Express
- JsonWebToken
- MongoDB
- Mongoose
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [body-parser](https://github.com/expressjs/body-parser)
- [CORS](https://github.com/expressjs/cors)
- [express validator](https://express-validator.github.io/docs/)
- [Morgan](https://github.com/expressjs/morgan)
- [Passport](https://www.passportjs.org/)

## Tool Used

- VS Code
- Atlas
- Heroku
- Postman

## To Run Locally

1. Clone or download repository first and open it with you favourite editor.
```bash
git clone https://github.com/Radnej/movie_api
```
2. Install the depedencies mentioned in package.json
```bash
$ npm install
```
3. start the server
```bash
$ npm run start
```
#### Access the app on http://localhost:8080

Note: Please make sure you install latest version of Node.js! 

## Endpoints

### Get data of all movies

<strong>Endpoint:</strong> `/movies`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about all movies


<img width="1008" alt="Get all movies" src="https://user-images.githubusercontent.com/91905344/206279149-736a3144-e601-45b4-9f6e-de69d874dd97.png">


### Get data of a single movie

<strong>Endpoint:</strong> `/movies/[movie ID]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about a movie containing description, genre, director, image URL

<strong>Format:</strong>

```
{
  Title: String, (required)
  Description: String, (required)
  Genre: {
    Name: String,
    Description: String
    },
    Director: {
      Name: String,
      Bio: String,
      Birth: Date, ("YYYY-MM-DD")
      Death: Date ("YYYY-MM-DD")
      },
      ImagePath: String,
      Featured: Boolean
}
```

<img width="1009" alt="Get a single movie" src="https://user-images.githubusercontent.com/91905344/206279226-15f470ba-5d29-4ebd-978b-6c417bf5b558.png">


### Get data of a genre

<strong>Endpoint:</strong> `/genres/[genre name]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about a genre

<strong>Format:</strong>

```
{
  Name: String,
  Description: String
}
```

<img width="1009" alt="Get a genre" src="https://user-images.githubusercontent.com/91905344/206279325-e644d3fd-0334-4bfe-9a77-c3a2830b77c7.png">

### Get data of a director

<strong>Endpoint:</strong> `/directors/[name]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about a director including bio, birth year, death year

<strong>Format:</strong>

```
{
  Name: String,
  Bio: String,
  Birth: Date, ("YYYY-MM-DD")
  Death: Date ("YYYY-MM-DD")
}
```
<img width="1007" alt="Get a director" src="https://user-images.githubusercontent.com/91905344/206280494-343038e4-5e1d-44cb-b731-977d953bf570.png">

### Add new user

<strong>Endpoint:</strong> `/users`

<strong>HTTP method:</strong> POST

<strong>Request body data format:</strong> JSON object holding data about the new user including username and mail

<strong>Format:</strong>

```
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

<strong>Response body data format:</strong> JSON object holding data about the new user including ID, username and mail

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```
<img width="958" alt="Add a user and register" src="https://user-images.githubusercontent.com/91905344/206279520-ea67eb28-219d-40cb-96c2-06ba1bc6c5bb.png">

### Get data of a single user

<strong>Endpoint:</strong> `/users/[username]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding the data about the user

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

### Update user data

<strong>Endpoint:</strong> `/users/[username]`

<strong>HTTP method:</strong> PUT

<strong>Request body data format:</strong> JSON object with the new user infos

<strong>Format:</strong>

```
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date ("YYYY-MM-DD")
}
```

<strong>Response body data format:</strong> JSON object holding the data about the new user

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

<img width="957" alt="Update a user by username" src="https://user-images.githubusercontent.com/91905344/206279687-c3eda49d-0f4b-43a2-8d8f-5c6f047433cf.png">


### Add movie to favorite list of user

<strong>Endpoint:</strong> `/users/[username]/movies/[movie ID]`

<strong>HTTP method:</strong> PUT

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding the new data about the user

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```
<img width="954" alt="Add movie from user's favorite movies list" src="https://user-images.githubusercontent.com/91905344/206279734-1d7fa378-5758-4284-9034-09d58ea5f56b.png">

### Remove movie from favorite list of user

<strong>Endpoint:</strong> `/users/[username]/movies/[movie ID]`

<strong>HTTP method:</strong> DELETE

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding the data about the user without the deleted movie

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}

```
<img width="965" alt="Remove movie from user's favorite movies list" src="https://user-images.githubusercontent.com/91905344/206279870-bd9dccdc-8139-43db-9b0b-0772fde0ffd3.png">

### Delete user

<strong>Endpoint:</strong> `/users/[username]`

<strong>HTTP method:</strong> DELETE

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> Text message indicating that the user email was removed

<img width="956" alt="Delete a user by username" src="https://user-images.githubusercontent.com/91905344/206279911-91df5cec-0f40-441d-965e-c183e90806a9.png">

