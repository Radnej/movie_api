const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

//mongoose models
const Movies = Models.Movie;
const Users = Models.User;

//connect to MongoDB

mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
  userNewUrlParser: true, 
  useUnifiedTopology: true, 
});

app.use(bodyParser.json());

// default text response when at /
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

//Return list of ALL movies to the user
app.get('/movies', (req, res) => {
  Movie.find().then((movies) => {
    res.status(200).json(movies);
  });
});


//CREAT user in the app
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username }).then((user) => {
  if(user) {
    return res.status(400).send('${req.body.Username} already exist');
  } else {
    Users.create({
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error: ${error}');
    });
  }
  });
});

//Update change username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true},
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error: ${err}');
      } else {
        res.json(updatedUser);
      }
    }
  )
});
//CREAT add movie to user favorit list 
app.post('/users/:Username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: {
        FavoritMovies: req.params.MovieID,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error: ${err}');
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//DELET  remove movie from user favorits  list 
app.delete('/users/:Username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: {
        FavoritMovies: req.params.MovieID,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error: ${err}');
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//DELET  User  
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username})
  .then((user) =>{
    if (!user) {
      return res.status(400).send('${req.params.Username} does not exist');
    } else {
      res.status(200).send('${req.params.Username} was deleted')
    }
  }).catch((err) =>{
    console.log(err);
    res.status(500).send('Error: ${err}');
  })
});



//READ Movies Name
app.get('/movies/:name', (req, res) => {
  Movies.findOne({ Name: req.params.name }).then((movie) => {
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('Movie not Found');
    }
  });
});

//READ Movies Genre
app.get('/movies/geners/:name', (req, res) => {
  Movie.findOne({ Name: req.params.name}).then((movie) => {
    if (movie) {
      res.status(200).send( '${req.params.name} is a ${movie.Genre.Name}');
    } else {
      res.status(400).send('Movie not Found');
    }
  });
});

//READ Movies Director
app.get('/movies/directors/:name', (req, res) => {
  Movie.findOne({'Director.Name': req.params.name}).then((movie) => {
    if (movie) {
      res.status(200).json(movie.Director);
    } else {
      res.status(400).send('Director not Found');
    }
  });
});


// Serve static content for the app from the 'public' directory
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

// Error handling (middleware)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

  // Listen to port 8080
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});


