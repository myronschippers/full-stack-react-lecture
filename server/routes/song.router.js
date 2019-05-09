const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

// Setup a GET route to get all the songs from the database
router.get('/', (req, res) => {
    // When you fetch all things in these GET routes, strongly encourage ORDER BY
    // so that things always come back in a consistent order 
    const sqlText = `SELECT * FROM songs ORDER BY published, artist, track DESC;`;
    pool.query(sqlText)
        .then((result) => {
            console.log(`Got stuff back from the database`, result);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        })
})

// There are other ways you might do this... 
// BUT to illustrate a req.params that isn't an id...
router.get('/artist/:artist', (req, res) => {
    const artistToGet = req.params.artist;
    const sqlText = `SELECT * FROM songs WHERE artist=$1`;
    pool.query(sqlText, [artistToGet])
        .then((result) => {
            console.log(`Songs for artist ${artistToGet}`, result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        })
})

// Setup a POST route to add a new song to the database
router.post('/', (req, res) => {
    const newSong = req.body;
    const sqlText = `INSERT INTO songs (rank, artist, track, published) VALUES 
  ($1, $2, $3, $4)`;
    // Let sql sanitize your inputs (NO Bobby Drop Tables here!)
    // the $1, $2, etc get substituted with the values from the array below
    pool.query(sqlText, [newSong.rank, newSong.artist, newSong.track, newSong.published])
        .then((result) => {
            console.log(`Added song to the database`, newSong);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        })
})

// Setup DELETE to remove a song from the database
// We are using a request parameter (req.params) to identify
// the song we want to delete. We expect this will be an id 
// from the database
router.delete('/:id', (req, res) => {
    let reqId = req.params.id;
    console.log('Delete request for id', reqId);
    let sqlText = 'DELETE FROM songs WHERE id=$1;';
    pool.query(sqlText, [reqId])
        .then((result) => {
            console.log('Song deleted');
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500); // Good server always responds
        })
})

// Change rank on my song - body will say up or down
router.put('/rank/:id', (req, res) => {
    let songId = req.params.id;
    // Direction will come from the client and say up or down
    let direction = req.body.direction;
    let sqlText = '';

    if (direction === 'up') {
        // use rank-1, so it get's closer to the awesome rank of 1
        sqlText = `UPDATE songs SET rank=rank-1 WHERE id=$1`;
    } else if (direction == 'down') {
        sqlText = `UPDATE songs SET rank=rank+1 WHERE id=$1`;
    } else {
        // If we don't get an expected direction, send back bad status
        res.sendStatus(500);
        return; // Do it now, don't run code below
    }

    pool.query(sqlText, [songId])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        })
})


module.exports = router;