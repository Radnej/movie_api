//cors
const cors = require('cors');
const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

//mongoose models
const Movies = Models.Movie;
const Users = Models.User;


let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'https://my-flix-220508.herokuapp.com/'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesnt allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

//connect to MongoDB

 // mongoose.connect('mongodb://localhost:27017/myFlixDB', {  
 //   useUnifiedTopology: true, 
 // });

mongoose.connect( process.env.CONNECTION_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('common'));

// import “auth.js” file
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


app.get('/', (req, res) => {

  res.send('Welcome to my myFlixxxx website');

});

//Get all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find()
  .then((movie) => {
    res.status(201).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:' + err);
  });
});

//Get a single movie
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.Title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Get a genre
app.get('/genres/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
      .then((movie) => {
          res.json(movie.Genre);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

// Get a director
app.get('/directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movie) => {
          res.json(movie.Director);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

//Update a user by username
app.put('/users/:Username',
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
 passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add movie from user's favorite movies list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
      { $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // this line makes sure that the updated document is returned
  (err, updatedUser) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
      } else {
          res.json(updatedUser);
      }
  });
});

// Remove movie from user's favorite movies list
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}),  (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
      { $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // this line makes sure that the updated document is returned
  (err, updatedUser) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
      } else {
          res.json(updatedUser);
      }
  });
});


// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}),  (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add a user and register

app.post('/users',

  // Validation logic here for request

  //you can either use a chain of methods like .not().isEmpty()

  //which means "opposite of isEmpty" in plain english "is not empty"

  //or use .isLength({min: 5}) which means

  //minimum value of 5 characters are only allowed

  [

    check('Username', 'Username is required').isLength({min: 5}),

    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),

    check('Password', 'Password is required').not().isEmpty(),

    check('Email', 'Email does not appear to be valid').isEmail()

  ], (req, res) => {



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

          return res.status(400).send(req.body.Username + ' already exists');
        } else {

          Users

            .create({

              Username: req.body.Username,

              Password: hashedPassword,

              Email: req.body.Email,

              Birthday: req.body.Birthday

            })

            .then((user) => { res.status(201).json(user) })

            .catch((error) => {

              console.error(error);

              res.status(500).send('Error: ' + error);

            });

        }

      })

      .catch((error) => {

        console.error(error);

        res.status(500).send('Error: ' + error);

      });

  });

// Error handling (middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Serve static content for the app from the 'public' directory
app.use(express.static('public'));

  // Listen to port 8080
  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
  });


