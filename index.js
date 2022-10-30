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
 * Get data of all movies
 * Endpoint: /movies
 * HTTP method: GET
 * @name getAllMovies
 * @returns JSON object holding data of all movies
 * @requires passport
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
 * Get data of a single movie
 * Endpoint: /movies/[movie ID]
 * HTTP method: GET
 * @name getMovie
 * @returns JSON object holding data about a movie containing description, genre, director, image URL
 * @requires passport
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
 * Get data of a genre
 * Endpoint: /genres/[genre name]
 * HTTP method: GET
 * @name getGenre
 * @returns JSON object holding data about a genre
 * @requires passport
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
 * Get data of a director
 * Endpoint: /directors/[name]
 * HTTP method: GET
 * @name getDirector
 * @returns JSON object holding data about a director including bio, birth year, death year
 * @requires passport
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
 * Update user data
 * Endpoint: /users/[username]
 * HTTP method: PUT
 * Request body data format: JSON object with the new user infos
 * Expect JSON in this format:
 * {
 *  Username: String, (required)
 *  Password: String, (required)
 *  Email: String, (required)
 *  Birthday: Date
 * }
 * @name updateUser
 * @returns JSON object holding the data about the new user
 * @requires passport
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
 * Endpoint: /users/[username]/movies/[movie ID]
 * HTTP method: POST
 * @name addMovieToFavorites
 * @returns JSON object holding the new data about the user
 * @requires passport
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
 * Remove movie from favorite list of user
 * Endpoint: /users/[username]/movies/[movie ID]
 * HTTP method: DELETE
 * @name removeMovieFromFavorites
 * @returns JSON object holding the data about the user without the deleted movie
 * @requires passport
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
 * Delete user
 * Endpoint: /users/[username]
 * HTTP method: DELETE
 * @name deleteUser
 * @returns {string} text message
 * @requires passport
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
 * Add new user
 * Endpoint: /users
 * HTTP method: POST
 * Request body data format: JSON object holding data about the new user including username and mail
 * Expect JSON in this format:
 * {
 *  ID: Integer,
 *  Username: String, (required)
 *  Password: String, (required)
 *  Email: String, (required)
 *  Birthday: Date
 * }
 * @get addUser
 * @returns JSON object holding data about the new user including ID, username and mail
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
 * Get data of a single user
 * Endpoint: /users
 * HTTP method: GET
 * @name getUser
 * @returns JSON object holding the data about all users
 * @requires passport
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
 * Get data of a single user
 * Endpoint: /users/[username]
 * HTTP method: GET
 * @name getUser
 * @returns JSON object holding the data about the user
 * @requires passport
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
