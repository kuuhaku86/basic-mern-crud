const Movie = require('../models/movie-model')

createMovie = (req, res) => {
    const body = req.body

    if(!body) {
        return res.status(404).json({
            success: false,
            error: 'You must provide a movie'
        })
    }

    const movie = new Movie(body)

    if(!movie)
        return res.status(500).json({
            success: false,
            error: err
        })

    movie
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: movie._id,
                message: 'Movie Created'
            })
        })
        .catch(error => {
            return res.status(500).json({
                error,
                message: 'Creating Movie Failed!'
            })
        })
}

updateMovie = async (req, res) => {
    const body = req.body

    if(!body) {
        return res.status(404).json({
            success: false,
            error: 'You must provide a movie'
        })
    }

    Movie.findOne({ _id: req.params.id}, (err, movie) => {
        if(err) {
            return res.status(500).json({
                err,
                message: 'Movie not found!'
            })
        }

        movie.name = body.name
        movie.time = body.time
        movie.rating = body.rating

        movie
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: movie._id,
                    message: 'Movie updated!'
                })
            })
            .catch(error => {
                return res.status(500).json({
                    error,
                    message: 'Movie not updated!'
                })
            })
    })
}

deleteMovie = async (req, res) => {
    await Movie.findOneAndRemove({ _id: req.params.id}, (err, movie) => {
        if(err) {
            return res.status(500).json({ success: false, error: err })
        }

        if(!movie) {
            return res
                    .status(404)
                    .json({ success: false, error: 'Movie not Foudn' })
        }

        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}

getMovieById = async (req, res) => {
    await Movie.findOne({ _id: req.params.id }, (err, movie) => {
        if(err) {
            return res.status(500).json({ success: false, error: err })
        }

        if(!movie) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: 'Movie Not Found!'
                })
        }

        return res.status(200).json({ success: true, data: movie })
    }).catch(err => console.log(err))
}

getMovies = async (req, res) => {
    await Movie.find({}, (err, movies) => {
        if(err) {
            return res.status(500).json({ success: false, error: err })
        }

        if(!movies.length) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: 'Movie Not Found'
                })
        }

        return res.status(200).json({ success: true, data: movies })
    }).catch(err => console.log(err))
}

module.exports = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
    getMovies
}