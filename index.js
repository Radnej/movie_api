//cors
const cors = require("cors");
const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");

//mongoose models
const Movies = Models.Movie;
const Users = Models.User;

let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "https://my-flix-220508.herokuapp.com/",
  "http://localhost:1234",
  "http://neflixx.netlify.app",
  "http://localhost:4200",
  "https://radnej.github.io/myFlix-Angular-client/welcome",
  "https://radnej.github.io",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesnt allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

//connect to MongoDB

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useUnifiedTopology: true,
// });

// mongoose.connect("http://localhost:8080", {
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("common"));

// import “auth.js” file
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.get("/", (req, res) => {
  res.send("Welcome to my myFlixxxx website");
});

/**
 * Get a list of all movies
 * @description - Get a list of all movies
 * @param {URL} - /movies
 * @param {HTTP} - GET
 * @param {Query_Parameters} - none
 * @param {Request_Body} - none
 * @param {Response} - array(JSON)
 * @param {authentication} - Bearer token (JWT)
 * @callback requestCallback
 * @returns {array(JSON)} - An array with a list with all the movies in the database
 */

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then(function (movie) {
        res.status(201).json(movie);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * Get all the information of the specified movie
 * @description - Get all the information of the specified movie
 * @param {URL} - /movies/:Title
 * @param {HTTP} - GET
 * @param {Query_Parameters} - :Title
 * @param {Request_Body} - none
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 * "Genre": {
 * "Name": "Animation",
 * "Description": "Is a method in which figures are manipulated to appear as moving images."
 * },
 * "Director": {
 * "Name": "Hayao Miyazaki",
 * "Bio": "Hayao Miyazaki is one of Japan greatest animation directors.",
 * "Birth": "1941-01-01"
 * },
 * "_id": "6356c4e6bf533055da4cae2a",
 * "Title": "Spirited Away",
 * "Description": "During her family move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, [...]",
 * "ImagePath": "https://upload.wikimedia.org/",
 * }
 * @param {authentication} - Bearer token (JWT)
 * @callback requestCallback
 * @returns {object} - An object with all the information for the movie specified
 */

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get all the information of the movie Genere
 * @description - Get the information of the movie Genere
 * @param {URL} - /genres/:Name
 * @param {HTTP} - GET
 * @param {Query_Parameters} - :Name
 * @param {Request_Body} - none
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 * "Genre": {
 * "Name": "Animation",
 * "Description": "Is a method in which figures are manipulated to appear as moving images."
 * },
 * }
 * @param {authentication} - Bearer token (JWT)
 * @callback requestCallback
 * @returns {object} - An object with all the information for the movie Genre specified
 */

app.get(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get all the information of the movie director
 * @description - Get the information of the movie director
 * @param {URL} - /directors/:Name
 * @param {HTTP} - GET
 * @param {Query_Parameters} - :Name
 * @param {Request_Body} - none
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 * "Director": {
 * "Name": "Hayao Miyazaki",
 * "Description": "Is a method in which figures are manipulated to appear as moving images."
 * },
 * }
 * @param {authentication} - Bearer token (JWT)
 * @callback requestCallback
 * @returns {object} - An object with all the information for the movie director specified
 */

app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Update the logged in user's information
 * @description - Update the logged in user's information
 * @param {URL} - /users/:Username
 * @param {HTTP} - PUT
 * @param {Query_Parameters} - :Username
 * @param {Request_Body} - JSON object
 * @example
 * // Request data format
 * {
 *  "Username": "User1",
 *  "Password": "Password1",
 *  "Email": "user1@email.com",
 *  "Birthdate:" "1990-01-01"
 * }
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 *  "_id": "asdasd123123123asd",
 *  "Username": "User1",
 *  "Password": "Password1",
 *  "Email": "user1@email.com",
 *  "Birthdate": "1990-01-01",
 *  "FavoriteMovies": [
 *    "qweqwe456456qwe",
 *    "zxczxc789789zxc,
 *  ]
 * }
 * @param {authentication} - Bearen token (JWT)
 * @callback requestCallback
 * @returns {object} - An object with the user's updated information
 */

app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Add movie to favorite list of user
 * @description - Add movie to favorite list of user
 * @param {URL} - /users/:Username/movies/:MovieID
 * @param {HTTP} - POST
 * @param {Query_Parameters} - :Username,:MovieID
 * @param {Request_Body} - JSON object
 * @example
 * // Request data format
 * {
 *  "Username": "User1",
 *  "MovieID": "zxczxc789789zxc"
 * }
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 *  "Username": "User1",
 *  "MovieID": "zxczxc789789zxc"
 * }
 
 * @param {authentication} - Bearen token (JWT)
 * @callback requestCallback
 * @returns {object} - An object with the user's updated information
 */

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // this line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Delete movie to favorite list of user
 * @description - Delete movie to favorite list of user
 * @param {URL} - /users/:Username/movies/:MovieID
 * @param {HTTP} - POST
 * @param {Query_Parameters} - :Username/:MovieID
 * @param {Request_Body} - JSON object
 * @example
 * // Request data format
 * {
 *  "Username": "User1",
 *  "MovieID": "zxczxc789789zxc"
 * }
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 *  "Username": "User1",
 *  "MovieID": "zxczxc789789zxc"
 * }
 * @param {authentication} - Bearen token (JWT)
 * @callback requestCallback
 * @returns {object} - An object with the user's updated information
 */

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // this line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Delete User
 * @description - Delete User
 * @param {URL} - /users/:Username
 * @param {HTTP} - DELETE
 * @param {Query_Parameters} - :Username
 * @param {Request_Body} - JSON object
 * @example
 * // Request data format
 * {
 *  "Username": "User1",
 * }
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 * "Username": "username1 was deleted"
 * }
 * @param {authentication} - Bearen token (JWT)
 * @callback requestCallback
 * @returns {object} - Username was not found
 */

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Add a new user
 * @description - Add a new user
 * @param {URL} - /users
 * @param {HTTP} - POST
 * @param {Query_Parameters} - none
 * @param {Request_Body} - JSON object
 * @example
 * // Request data format
 * {
 *  "Username": "User1",
 *  "Password": "Password1",
 *  "Email": "user1@email.com",
 *  "Birthdate:" "1990-01-01"
 * }
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 *  "_id": "asdasd123123123asd",
 *  "Username": "User1",
 *  "Password": "Password1",
 *  "Email": "user1@email.com",
 *  "Birthdate": "1990-01-01",
 * }
 * @param {authentication} - Bearen token (none)
 * @callback requestCallback
 * @returns {object} - An object with the new user including ID, username and mail
 */

app.post(
  "/users",
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Get all users
 * @description - Get all users
 * @param {URL} - /users
 * @param {HTTP} - GET
 * @param {Query_Parameters} - none
 * @param {Request_Body} - none
 * @param {Response} - array(JSON)
 * @param {authentication} - Bearer token (JWT)
 * @callback requestCallback
 * @returns {array(JSON)} - An array with a list with all the users in the database
 */

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.find()
      .then(function (users) {
        res.status(201).json(users);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get all the information of the singel user
 * @description - Get all the information of the singel user
 * @param {URL} - /users/:Username
 * @param {HTTP} - GET
 * @param {Query_Parameters} - :Username
 * @param {Request_Body} - none
 * @param {Response} - JSON object
 * @example
 * // Response data format
 * {
 *  "_id": "asdasd123123123asd",
 *  "Username": "User1",
 *  "Password": "Password1",
 *  "Email": "user1@email.com",
 *  "Birthdate": "1990-01-01",
 * }
 * @param {authentication} - Bearer token (JWT)
 * @callback requestCallback
 * @returns {object} - An object with all the information for the singel user
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    console.log(req.params.Username);
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Error handling (middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Serve static content for the app from the 'public' directory
app.use(express.static("public"));

// Listen to port 8080
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
