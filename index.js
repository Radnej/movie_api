const express = require('express');
const app = express();

// Import Morgan middleware library
const morgan = require('morgan');

// Create array of objects that holds top 10 movies
let topMovies = [
    {
      name: 'Licorice Pizza',
      director: 'Paul Thomas Anderson'
    },
    {
      name: 'Encanto',
      director: 'Jared Bush, Byron Howard, Charise Castro Smith'
    },
    {
      name: 'Free Guy',
      director: 'Shawn Levy'
    },
    {
        name: 'Dog',
        director: 'Reid Carolin, Channing Tatum'
      },
      {
        name: 'Ghostbusters: Afterlife',
        director: 'Jason Reitman '
      },
      {
        name: 'Marry Me',
        director: 'Kat Coiro'
      },
      {
        name: 'The French Dispatch',
        director: 'Wes Anderson'
      },
      {
        name: 'Studio 666',
        director: 'BJ McDonnell'
      },
      {
        name: 'Sing 2',
        director: 'Garth Jennings'
      },
      {
        name: 'CODA',
        director: 'Sian Heder'
      },

  ];

// GET requests (returns a JSON object containing data about top 10 movies).
app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  // GET Welcome message for '/' request URL
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
  });

// Serve static content for the app from the 'public' directory
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