let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Movie = require('../models/movie');
const movie = require('../models/movie');

//Authentication
function requireAuth(req,res,next){
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

//Router GET
router.get('/',async(req,res,next)=>{
try{
    const MovieList = await Movie.find();
    res.render('Movie/list',{
        title:'Movies',
        displayName: req.user? req.user.displayName:'',
        MovieList:MovieList
    })}
    catch(err){
        console.error(err);
        res.render('Movie/list',{
            error:'Error on the server'
        })
    }
    });
    router.get('/home',async(req,res,next)=>{
        try{
            const MovieList = await Movie.find();
            res.render('Movie/list',{
                title:'Movies',
                displayName: req.user? req.user.displayName:'',
                MovieList:MovieList
            })}
            catch(err){
                console.error(err);
                res.render('Movie/list',{
                    error:'Error on the server'
                })
            }
            });
    
router.get('/add',async(req,res,next)=>{
    try{
        res.render('Movie/add',{
            title: 'Add Movie',
            displayName: req.user? req.user.displayName:''
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Movie/list',{
            error:'Error on the server'
        })
    }
});

router.post('/add',async(req,res,next)=>{
    try{
        let newMovie = Movie({
            "Name":req.body.Name,
            "Genre":req.body.Genre,
            "Year":req.body.Year,
            "Review":req.body.Review
        });
        Movie.create(newMovie).then(()=>{
            res.redirect('/movieslist');
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Movie/list',{
            error:'Error on the server'
        })
    }
});

router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const movieToEdit= await Movie.findById(id);
        res.render('Movie/edit',
            {
                title:'Edit Movie',
                displayName: req.user? req.user.displayName:'',

                Movie:movieToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err);
    }
});

router.post('/edit/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        let updatedMovie = Movie({
            "_id":id,
            "Name":req.body.Name,
            "Genre":req.body.Genre,
            "Year":req.body.Year,
            "Review":req.body.Review
        });
        Movie.findByIdAndUpdate(id,updatedMovie).then(()=>{
            res.redirect('/movieslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Movie/list',{
            error:'Error on the server'
        })
    }
});
router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        Movie.deleteOne({_id:id}).then(()=>{
            res.redirect('/movieslist')
        })
    }
    catch(error){
        console.error(err);
        res.render('Movie/list',{
            error:'Error on the server'
        })
    }
});
module.exports = router;