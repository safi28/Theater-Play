const { Router } = require('express')
const router = Router()
const config = require('../config/config')
const { validationResult } = require('express-validator')
const { getUserStatus, signUp, signIn, guestAccess, authAccess } = require('../controllers/auth')
const authCookie = config.development.cookie
const validations = require('../utils/validator')
const User = require('../models/User')

router.get('/user/login', getUserStatus, (req, res) => {
    res.render('auth/login', {
        titleTextText: "Login Page",
        isLoggedIn: req.isLoggedIn
    })
})
router.get('/user/register', guestAccess, getUserStatus, (req, res) => {
    res.render('auth/register', {
        titleTextText: "Register Page",
        isLoggedIn: req.isLoggedIn
    })
})
router.post('/user/register', validations, async(req, res) => {
    const { username, password, repeatPassword } = req.body    
    const errors = validationResult(req)           
     
    if(!errors.isEmpty()) {
        const user = await User.find({ username: username })    
        if(password !== repeatPassword) {            
            res.render('auth/register', {
                titleText: "Register Page",
                isLoggedIn: req.isLoggedIn,
                message: errors.array()[1].msg
            })
            return
        } 
        if(user.length > 0) {            
            res.render('auth/register', {
                titleText: "Register Page",
                isLoggedIn: req.isLoggedIn,
                message: 'User already exist'
            })
            return
        }     
        if(username.length < 3 || password.length < 3) {
           res.render('auth/register', {
            titleText: "Register Page",
            isLoggedIn: req.isLoggedIn,
            message: errors.array()[1].msg
        }) 
        return
        }            
    }
    const status = await signUp(req, res)            
    if(status) {
        res.status(200)
        return res.redirect('/user/login')
    }
})
router.post('/user/login', validations, async(req, res) => {
    const { username, password } = req.body    
    const errors = validationResult(req)        
    if(!errors.isEmpty()) {
        const user = (await User.findOne({ username: username }))  
        if(user === null) {
            res.render('auth/login', {
                titleText: "Login Page",
                isLoggedIn: req.isLoggedIn,
                message: 'User does not exist'
            })
            return
        }
    }
    const status = await signIn(req, res)
    if(status) {
        res.status(200)
        return res.redirect('/')
    }

})
router.get('/user/logout', authAccess, (req, res) => {
    res.clearCookie(authCookie)
    req.isLoggedIn = false
    res.redirect('/')
})

module.exports = router