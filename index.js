const express = require('express');
const app = express();
app.use(express.json());
const log = require('./middlewares/log');
const morgan = require('morgan');
const Joi = require('joi');
app.use(express.urlencoded({extended:true})); 
app.use(express.static('public'));

app.use(morgan('tiny'));
app.use(log);

/***
 * Json Data 
 */
const movies = [
    {id: 1, category: "Bollywood", name: "Jodha-Akbar", release_Date: "1-02-2014"},
    {id: 2, category: "Hollywood", name: "Avengers", release_Date: "27-04-2019"},
    {id: 3, category: "Telugu", name: "Geetha-Govindam", release_Date: "4-05-2016"},
    {id: 4, category: "Cartoon", name: "Frozen", release_Date: "1-03-2013"}
]

/**
 * @author Pooja Sharma
 * To fetch all movies data
 */
app.get('/api/movie', (req, res) => {
    res.send(movies);
 });


/**
 * @author Pooja Sharma
 * To fetch perticuler movie data by ID
 */
app.get('/api/movie/:id', (req, res) => {
   const movieId = movies.find(m => m.id === parseInt(req.params.id));
    if(!movieId) return res.status(404).send('This movie id is not available');
     res.send(movieId);
});


/**
 * @author Pooja Sharma
 * To add new movie data
 */
app.post('/api/movie', (req, res) => {
     //Valid movie data validation
    const { error } = validateInputdata(req.body);
     if(error) return res.status(400).send(error.details[0].message);
   
  const newMovie = {
        id: movies.length + 1,
        category: req.body.category,
        name: req.body.name,
        release_Date: req.body.release_Date
    };

    // Add movie data
    movies.push(newMovie);
    res.send(newMovie);
});

/***
 * @author Pooja Sharma
 * Update movie name by ID
 */

app.put('/api/movie/:id', (req, res) => {
    //Name validation
    const new_movie_name = movies.find(m => m.id === parseInt(req.params.id));
    if(!new_movie_name) return res.status(404).send('This movie id is not available');

    // Movie data validation
    const { error } = validateInputdata(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Update movie data
    new_movie_name.name = req.body.name;
    res.send(new_movie_name);
});

/***
 * @author Pooja Sharma
 * Delete movie data by id
 */

app.delete('/api/movie/:id', (req, res) => {
    // Category validation
    const old_movie_Id = movies.find(m => m.id === parseInt(req.params.id));
    if(!old_movie_Id) return res.status(404).send('This movie id is not available');

    // delete movie data
    const number = movies.indexOf
    
    (old_movie_Id);
    movies.splice(number,1);

    res.send(old_movie_Id);
});

/**
 * Data validation
 */
function validateInputdata(result) {
 
    const schema = {
        category:Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
        release_Date:Joi.string().required()
    }

    return Joi.validate(result, schema);
}

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listen on port  ${port}`));

