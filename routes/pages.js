const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')
router.get('/',authController.isLoggedIn,(req,res) => {
    if(req.user){
        res.render('index',{
            user: req.user
        });
    }else{
        res.render('index');
    }
});
router.get('/login',(req,res) =>{
    res.render('login');
});
router.get('/register',(req,res) =>{
    res.render('register');
});
router.get('/profile',authController.isLoggedIn,(req,res) =>{
    console.log('ggg',req.user)
    if(req.user){
        res.render('userprofile',{
            user: req.user
        });
    }else{
        res.redirect('/login');
    }
    
});
module.exports = router;