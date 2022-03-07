const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
morgan = require('morgan');

const app = express();

app.use(bodyParser.json());

let users = [
  {
    username: 1,
    favoritMovies: ['Licorice Pizza', 'Scream']
  },
  {
    username: 2,
    favoritMovies: ['Licorice Pizza']

  }
];
let movies = [
  {
  name: 'Licorice Pizza',
  year: 2022,
  genre: {
  name: 'Comedy',
  description:'LICORICE PIZZA is the story of Alana Kane and Gary Valentine growing up, running around and falling in love in the San Fernando Valley, 1973. Written and Directed by Paul Thomas Anderson, the film tracks the treacherous navigation of first love.',
},
  director: { 
    name:'Paul Thomas Anderson'
    bio:'Anderson was born in 1970. He was one of the first of the "video store" generation of film-makers. His father was the first man on his block to own a V.C.R., and from a very early age Anderson had an infinite number of titles available to him. While film-makers like Spielberg cut their teeth making 8 mm films, Anderson cut his teeth shooting films on video and editing them from V.C.R. to V.C.R.',
    birth:1970
  },
  imageURL:'https://www.imdb.com/title/tt11271038/?ref_=adv_li_i',
  featured: true
},
{
  name: 'Scream ',
  year: 2021
  genre: {
    name: 'Horror',
    description:'Twenty-five years after the original series of murders in Woodsboro, a new Ghostface emerges, and Sidney Prescott must return to uncover the truth.',
},
  director: { 
    name:'Matt Bettinelli-Olpin'
    bio:'Matt Bettinelli-Olpin is a director and writer, known for Scream (2022), Ready or Not (2019) and Southbound (2015).',
    birth:
  },
  imageURL:'https://www.imdb.com/title/tt11245972/mediaviewer/rm3414551553/?ref_=tt_ov_i',
  features: true
}
];

//CREAT user in the app
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.username) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(404).send('Missing username in request body');
  }
});

//Update change username
app.put('/users/:username', (req, res) => {
  const newUsername = req.body;
  let user = users.find((user) => { return user.username === req.params.username });

  if (user) {
    user.name = newUsername.username;
    res.status(200).json(user);
  } else {
    res.status(400).send('User not found');
  }
});

//CREAT add movie to user favorit list 
app.post('/users/:username/:movie', (req, res) => {
  let user = users.find( (user) => { return user.username === req.params.username });

  if (user) {
    user.favoritMovies.push(req.params.movieTitle);
    res.status(200).send(req.params.movie + 'was added to ' + user.username + "'s favorites list.");
  } else {
    res.status(400).send('User not found');
  }
});

//DELET  remove movie from user favorits  list 
app.delete('/users/:username/:movie', (req, res) => {
  let user = users.find((users => { return user.username === req.params.username });

  if (user) {
    user.favorites = user.favorites.filter((mov) => { return mov !== req.params.username});
    res.status(200).send(req.params.movie + 'was removed from ' + user.username + "'s favorites list.")
  } else {
    res.status(400).send('user not found.');
  }
});

//DELET  User  
app.delete('/users/:username', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username} );

  if (user) {
    users = users.filter((user) => { return user.username != req.params.username});
    res.status(201).send(req.params.username + 'was deleted');
  } else {
    res.status(404).send('user not found');
  }
});



//READ Movies Name
app.get('/movies/:name', (req, res) => {
  const name = movies.find((movie) => movie.name === req.params.name).name;

  if (name) {
    res.status(200).json(name);
} else {
  res.status(400).send('Movie not found');
}
});

//READ Movies Genre
app.get('/movies/genre/:genre', (req, res) => {
  const genre = movies.find( movie => movie.genre.name === req.params.genre).genre;

  if (genre) {
    res.status(200).json(genre);
} else {
  res.status(400).send('Genre not found');
}
});

//READ Movies Director
app.get('/movies/directors/:name', (req, res) => {
  const director = movies.find( movie => movie.director.name === req.params.name).director;

  if (director) {
    res.status(200).json(director);
} else {
  res.status(400).send(' Director not found');
}
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


