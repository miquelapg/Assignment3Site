let express = require('express');
let router = express.Router();
const passport = require('passport');
const DB = require('../config/db');

let userModel = require('../models/user');
let User = userModel.User;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/login',function(req,res,next){
  if(!req.user)
  {
    res.render('Auth/login',(
      {
        title:'Login',
        message:req.flash('loginMessage'),
        displayName: req.user ? req.user.displayName:''
      }))
  }
  else
  {
    return res.redirect('/')
  }
})

router.post('/login', function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err)
    }
    if(!user)
    {
      req.flash('loginMessage','Authentication Error');
      return res.redirect('/login');
    }
    req.login(user,(err)=>{
      if(err)
      {
        return next(err)
      }
      return res.redirect('/movieslist')
    })
  })(req,res,next)
})

router.get('/register',function(req,res,next){
  if(!req.user)
  {
    res.render('Auth/register',{
      title:'Register',
      message:req.flash('registerMessage'), 
      displayName: req.user?req.user.displayName:''
    })
  }
  else{
    return res.redirect('/')
  }
})

router.post('/register',function(req,res,next){
  let newUser = new User({
    username:req.body.username,
    //password:req.body.password,
    email:req.body.email,
    displayName:req.body.displayName
  })
  User.register(newUser,req.body.password,(err) =>{
    if(err)
    {
      console.log("Error:Inserting the new User");
      if(err.name=="UserExistError")
      {
        req.flash('registerMessage',
          'Registration Error: User already exists')
      }
      return res.render('Auth/register',{
        title:'Register',
        message:req.flash('registerMessage'),
        displayName:req.user?req.user.displayName:''
      })
      }
      else
      {
        return passport.authenticate('local')(req,res,() =>{
          res.redirect('/movieslist')
        })
      }
    })
  })
  
router.get('/logout',function(req,res,next){
  req.logOut(function(err){
    if(err)
    {
      return next(err);
    }
  })
  res.redirect('/')
})

module.exports = router;
