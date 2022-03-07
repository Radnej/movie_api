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
    name:'Paul Thomas Anderson',
    bio:'Anderson was born in 1970. He was one of the first of the "video store" generation of film-makers. His father was the first man on his block to own a V.C.R., and from a very early age Anderson had an infinite number of titles available to him. While film-makers like Spielberg cut their teeth making 8 mm films, Anderson cut his teeth shooting films on video and editing them from V.C.R. to V.C.R.',
    birth:1970
  },
  imageURL:'https://www.imdb.com/title/tt11271038/?ref_=adv_li_i',
  featured: true
},
{
  name: 'Scream ',
  year: 2021,
  genre: {
    name: 'Horror',
    description:'Twenty-five years after the original series of murders in Woodsboro, a new Ghostface emerges, and Sidney Prescott must return to uncover the truth.',
},
  director: { 
    name:'Matt Bettinelli-Olpin',
    bio:'Matt Bettinelli-Olpin is a director and writer, known for Scream (2022), Ready or Not (2019) and Southbound (2015).',
    birth:''
  },
  imageURL:'https://www.imdb.com/title/tt11245972/mediaviewer/rm3414551553/?ref_=tt_ov_i',
  features: true
}
];

//CREAT user in the app
app.post('/users', (req, res) => {
  res.send('Add user');
});

//Update change username
app.put('/users/:username', (req, res) => {
  const newUsername = req.body;
  res.send('Update user by username');
});
//CREAT add movie to user favorit list 
app.post('/users/:username/:movie', (req, res) => {
  res.send('Add movie');
});

//DELET  remove movie from user favorits  list 
app.delete('/users/:username/:movie', (req, res) => {
  res.send('delet movie');
});

//DELET  User  
app.delete('/users/:username', (req, res) => {
  res.send('delet user');
});



//READ Movies Name
app.get('/movies/:name', (req, res) => {
  res.send('Show movie name');
});

//READ Movies Genre
app.get('/movies/genre/:genre', (req, res) => {
  res.send('Show movie genre');
});

//READ Movies Director
app.get('/movies/directors/:name', (req, res) => {
  res.send('Show director name');
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


